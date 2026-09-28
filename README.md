# Mini Football Field Management System :System Architecture & Design Specification

## 1. Scope and architecture
The existing **Mini Football Field Management Architecture** diagram is the architectural reference for this specification. It separates **Role-based interfaces**, **Business constants · single source of truth**, **Java Spring Boot · authenticated REST API · transactional domain services**, and **SQL Server · 15-table transactional persistence**. This document specifies their implementation without replacing or modifying the existing workspace ERD.

| Concern | Design |
| :--- | :--- |
| Facility | 12 fields; operating hours **07:00–24:00** each service day |
| Application | Java Spring Boot authenticated REST API, domain services, JPA/JDBC, SQL transactions |
| Persistence | SQL Server; exactly 15 application tables specified below |
| Staff · Receptionist | Operational rights: bookings, check-in, payments, POS, and incident reporting |
| Manager / Owner | Full administrative rights, including pricing, inventory, staff, reports, and audit review |
| Customers | No customer accounts. A unique phone number identifies a transparent CRM profile. |
| Monetary values | VND; persist as `DECIMAL(18,2)`, never floating point |
| Time | REST uses ISO 8601 timestamps with offsets. Booking boundaries use SQL Server `DATETIME2(7)` in the configured facility time zone; audit timestamps use UTC `DATETIME2(7)`. |

A booking occupies a half-open interval `[start_at, end_at)`: one booking may end exactly when another begins. `24:00` is represented as `00:00` **on the following calendar date**, never as an invalid SQL time value. A booking must begin no earlier than 07:00 and end no later than the midnight closing that follows its start date. Pricing rules instead use integer minutes from the service-day midnight: `0–1440`, with `1440` representing 24:00.

---

## 2. Phase 0 :Business constants and guard rules
Keep these values in a single versioned policy implementation used by commands, scheduled jobs, and tests. Do not duplicate calculations in controllers or clients.

| Rule | Required behavior |
| :--- | :--- |
| Deposit | **50% of the total booking value at booking confirmation.** The server calculates the booking value and deposit; client-supplied amounts are not authoritative. |
| Cancellation refund, remaining time `t ≥ 24h` | Refund **100% of the deposit paid**. |
| Cancellation refund, `3h ≤ t < 24h` | Refund **40% of the deposit paid**; retain the other 60%. |
| Cancellation refund, `t < 3h` | Refund **0%**; retain the entire deposit as revenue. |
| Time change | Permit only when **at least 3 hours remain before the current booking start**. Revalidate availability and pricing transactionally. |
| Overtime eligibility | Booking must be `IN_PROGRESS` and the request must occur **from 20 minutes before its current end until, but not including, its current end**. |
| Overtime charge | **50,000 VND per 30-minute block**. Charge `ceil(requested_extension_minutes / 30)` blocks; requested duration must be positive. |
| Not attend | If the customer has not arrived **more than 20 minutes after start**, transition to `NOT_ATTEND`, retain **100% of the deposit**, and increment `Customers.all_time_boom` once. |
| Salary | `total_hours × 40,000 VND`, using recorded work-shift hours. |

### Guard evaluation
- Calculate `t = start_at − decision_time` at the server, using one transaction-consistent decision timestamp. At exactly 24 hours use the 100% tier; at exactly 3 hours use the 40% tier.
- The not-attend threshold is strict: `decision_time > start_at + 20 minutes`. Check-in and not-attend must compete through the same locked booking row so neither can succeed after the other.
- An overtime request at exactly `end_at − 20 minutes` qualifies; one at or after `end_at` does not. The extended end must still respect facility closing and must not overlap another active booking.
- Price the original field interval from applicable `Pricing_rules`, then persist `Bookings.field_amount` as its snapshot. Persist overtime separately in `Bookings.overtime_amount`; the current booking value is their sum. Existing snapshots do not change when a pricing rule is edited.
- On a time change, resolve and snapshot the replacement field price and reconcile the resulting deposit obligation against ledger entries. Do not silently overwrite a paid deposit, issue an unspecified refund, or fabricate a payment: post the appropriate financial action and audit event before completing the command.
- Record retained deposit value as a `RETAINED` ledger entry. It represents a transfer to recognized revenue, **not another cash receipt**. Keep compensation fees for lost or damaged equipment outside the main booking invoice.

---

## 3. Phase 1 :Physical SQL Server schema

### 3.1 Table inventory and relationships
The **15** tables match the architecture diagram’s five persistence groups.

| Group | Tables | Count |
| :--- | :--- | :--- |
| HR & shifts | `Roles`, `Employees`, `Work_shifts` | 3 |
| Customer CRM | `Customers` | 1 |
| Booking, pricing & ledger | `Fields`, `Pricing_rules`, `Bookings`, `Payments`, `Invoices`, `Booking_events` | 6 |
| POS & stock | `Products`, `Service_orders`, `Service_order_items` | 3 |
| Equipment & incidents | `Equipments`, `Incident_reports` | 2 |
| **Total** | | **15** |

`Bookings.customer_id → Customers.customer_id`; `Invoices.booking_id` is unique, enforcing **at most one invoice per booking**. Create that invoice in the booking transaction to enforce **exactly one** in application workflows. Optional `Service_orders.booking_id` associates a sale with a booking. `Incident_reports` reference both the booking and equipment, but their compensation is not added to `Invoices`.

### 3.2 DBML
The following DBML defines columns, SQL Server data types, PKs, FKs, and principal unique and lookup indexes. Apply the additional SQL Server constraints and concurrency controls in §3.3 through versioned migrations.

```dbml
Table Roles {
  role_id bigint [pk, increment]
  role_code varchar(32) [not null, unique]
  role_name nvarchar(100) [not null]
}

Table Employees {
  employee_id bigint [pk, increment]
  role_id bigint [not null, ref: > Roles.role_id]
  full_name nvarchar(150) [not null]
  login_name varchar(100) [not null, unique]
  password_hash varchar(255) [not null]
  is_active bit [not null]
}

Table Work_shifts {
  shift_id bigint [pk, increment]
  employee_id bigint [not null, ref: > Employees.employee_id]
  start_at datetime2(7) [not null]
  end_at datetime2(7) [not null]
  total_hours decimal(9,2) [not null]
  salary_amount decimal(18,2) [not null]

  indexes {
    (employee_id, start_at) [name: "ix_work_shifts_employee_start"]
  }
}

Table Customers {
  customer_id bigint [pk, increment]
  phone nvarchar(20) [not null, unique]
  full_name nvarchar(150)
  all_time_success int [not null]
  all_time_cancel int [not null]
  all_time_boom int [not null]
  created_at datetime2(7) [not null]
}

Table Fields {
  field_id bigint [pk, increment]
  field_name nvarchar(100) [not null, unique]
  is_active bit [not null]
}

Table Pricing_rules {
  pricing_rule_id bigint [pk, increment]
  field_id bigint [not null, ref: > Fields.field_id]
  day_of_week tinyint [not null]
  start_minute int [not null]
  end_minute int [not null]
  rate_per_minute decimal(18,4) [not null]
  effective_from date [not null]
  effective_to date

  indexes {
    (field_id, day_of_week, effective_from, start_minute)
      [name: "ix_pricing_rules_resolution"]
  }
}

Table Bookings {
  booking_id bigint [pk, increment]
  field_id bigint [not null, ref: > Fields.field_id]
  customer_id bigint [not null, ref: > Customers.customer_id]
  booked_by_employee_id bigint [not null, ref: > Employees.employee_id]
  start_at datetime2(7) [not null]
  end_at datetime2(7) [not null]
  status varchar(16) [not null]
  field_amount decimal(18,2) [not null]
  overtime_amount decimal(18,2) [not null]
  created_at datetime2(7) [not null]
  updated_at datetime2(7) [not null]
  row_version rowversion [not null]

  indexes {
    (field_id, start_at, end_at)
      [name: "ix_bookings_field_interval"]
    (customer_id, start_at)
      [name: "ix_bookings_customer_start"]
  }
}

Table Payments {
  payment_id bigint [pk, increment]
  booking_id bigint [not null, ref: > Bookings.booking_id]
  recorded_by_employee_id bigint [not null, ref: > Employees.employee_id]
  kind varchar(16) [not null]
  amount decimal(18,2) [not null]
  idempotency_key varchar(100) [not null, unique]
  recorded_at datetime2(7) [not null]

  indexes {
    (booking_id, recorded_at) [name: "ix_payments_booking_recorded"]
  }
}

Table Invoices {
  invoice_id bigint [pk, increment]
  booking_id bigint [not null, unique, ref: > Bookings.booking_id]
  booking_total decimal(18,2) [not null]
  deposit_due decimal(18,2) [not null]
  balance_due decimal(18,2) [not null]
  issued_at datetime2(7) [not null]
}

Table Booking_events {
  event_id bigint [pk, increment]
  booking_id bigint [not null, ref: > Bookings.booking_id]
  actor_employee_id bigint [ref: > Employees.employee_id]
  event_type varchar(40) [not null]
  from_status varchar(16)
  to_status varchar(16)
  old_start_at datetime2(7)
  old_end_at datetime2(7)
  new_start_at datetime2(7)
  new_end_at datetime2(7)
  occurred_at datetime2(7) [not null]
  details_json nvarchar(max)

  indexes {
    (booking_id, occurred_at) [name: "ix_booking_events_booking_time"]
  }
}

Table Products {
  product_id bigint [pk, increment]
  product_name nvarchar(150) [not null]
  current_unit_price decimal(18,2) [not null]
  stock int [not null]
  min_stock int [not null]
  is_active bit [not null]
}

Table Service_orders {
  order_id bigint [pk, increment]
  booking_id bigint [ref: > Bookings.booking_id]
  sold_by_employee_id bigint [not null, ref: > Employees.employee_id]
  sold_at datetime2(7) [not null]
  total_amount decimal(18,2) [not null]
}

Table Service_order_items {
  item_id bigint [pk, increment]
  order_id bigint [not null, ref: > Service_orders.order_id]
  product_id bigint [not null, ref: > Products.product_id]
  quantity int [not null]
  unit_price decimal(18,2) [not null]
}

Table Equipments {
  equipment_id bigint [pk, increment]
  equipment_name nvarchar(150) [not null]
  is_active bit [not null]
}

Table Incident_reports {
  report_id bigint [pk, increment]
  equipment_id bigint [not null, ref: > Equipments.equipment_id]
  booking_id bigint [not null, ref: > Bookings.booking_id]
  reported_by_employee_id bigint [not null, ref: > Employees.employee_id]
  classification varchar(16) [not null]
  quantity int [not null]
  compensation_fee decimal(18,2) [not null]
  description nvarchar(1000)
  reported_at datetime2(7) [not null]

  indexes {
    (booking_id, reported_at) [name: "ix_incident_reports_booking_time"]
  }
}
