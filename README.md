`` ``// NHÓM 1: QUẢN LÝ NHÂN SỰ & CA LÀM
Roles [icon: user] {
 ID int [pk]
 code varchar(20)
 Name nvarchar(50)
}

Employees [icon: users] {
 ID bigint [pk]
 role_ID int
 full_name nvarchar(100)
 phone varchar(15)
 username varchar(50)
 password_hash varchar(255)
 status varchar(20)
 Created_at datetime2
 updated_at datetime2
}

Work_shifts [icon: clock] {
 ID bigint [pk]
 Employee_ID bigint
 Start_at datetime2
 end_at datetime2
 Total_hours decimal(5,2)
 Created_at datetime2
}

// NHÓM 2: CRM & KHÁCH HÀNG
Customers [icon: heart] {
 ID bigint [pk]
 Full_name nvarchar(100)
 Phone varchar(15)
 All_time_success int
 all_time_cancel int
 all_time_boom int
 Created_at datetime2
 updated_at datetime2
}

// NHÓM 3: ĐẶT SÂN & DÒNG TIỀN
Fields [icon: grid] {
 ID int [pk]
 Name nvarchar(50)
 Status varchar(20)
 Created_at datetime2
}

Pricing_rules [icon: dollar-sign] {
 ID int [pk]
 Day_type varchar(20)
 Start_minute int
 end_minute int
 Price_per_hour decimal(12,2)
 Is_active bit
 Effective_from date
 Effective_to date
}

Bookings [icon: calendar] {
 ID bigint [pk]
 Booking_code varchar(30)
 Customer_ID bigint
 Field_ID int
 Start_at datetime2
 End_at datetime2
 Status varchar(20)
 Field_amount decimal(12,2)
 Created_by bigint
 Created_at datetime2
 updated_at datetime2
}

Payments [icon: credit-card] {
 ID bigint [pk]
 Booking_ID bigint
 Payment_type varchar(20)
 Amount decimal(12,2)
 Created_by bigint
 Created_at datetime2
}

Invoices [icon: file-text] {
 ID bigint [pk]
 Booking_ID bigint
 Invoice_code varchar(30)
 Subtotal_field decimal(12,2)
 Overtime_amount decimal(12,2)
 Total_amount decimal(12,2)
 paid_at datetime2
 Created_by bigint
}

Booking_events [icon: activity] {
 ID bigint [pk]
 Booking_ID bigint
 Event_type varchar(30)
 old_start_at datetime2
 new_start_at datetime2
 old_end_at datetime2
 new_end_at datetime2
 Extra_minutes int
 Financial_amount decimal(12,2)
 Old_status varchar(20)
 new_status varchar(20)
 Created_by bigint
 Created_at datetime2
}

// NHÓM 4: BÁN LẺ DỊCH VỤ (POS)
Products [icon: package] {
 ID int [pk]
 Name nvarchar(100)
 Unit nvarchar(20)
 Status varchar(20)
 Price decimal(12,2)
 Stock_quantity int
 min_stock_level int
}

Service_orders [icon: shopping-cart] {
 ID bigint [pk]
 Order_code varchar(30)
 Total_amount decimal(12,2)
 Created_by bigint
 Created_at datetime2
}

Service_order_items [icon: list] {
 ID bigint [pk]
 Service_order_ID bigint
 Product_ID int
 Quantity int
 Unit_price decimal(12,2)
 Subtotal decimal(12,2)
}

// NHÓM 5: SỰ CỐ & THIẾT BỊ
Equipments [icon: tool] {
 ID int [pk]
 Name nvarchar(50)
 Usable_quantity int
}

Incident_reports [icon: alert-triangle] {
 ID bigint [pk]
 Equipment_ID int
 Booking_ID bigint
 Incident_type varchar(20)
 Quantity int
 Reason nvarchar(255)
 Status varchar(20)
 Compensation_amount decimal(12,2)
 Approved_by bigint
 Created_by bigint
 Created_at datetime2
 Updated_at datetime2
}

// ==========================================
// CÁC ĐƯỜNG LIÊN KẾT (RELATIONSHIPS)
// Cú pháp: Bảng_1.Cột_1 > Bảng_2.Cột_2 (1:N)
// ==========================================

// Quan hệ Nhân sự
Roles.ID < Employees.role_ID
Employees.ID < Work_shifts.Employee_ID

// Quan hệ Đặt sân & Khách hàng
Customers.ID < Bookings.Customer_ID
Fields.ID < Bookings.Field_ID
Employees.ID < Bookings.Created_by

// Quan hệ Dòng tiền & Lịch sử Đơn
Bookings.ID < Payments.Booking_ID
Employees.ID < Payments.Created_by
Bookings.ID - Invoices.Booking_ID
Employees.ID < Invoices.Created_by
Bookings.ID < Booking_events.Booking_ID
Employees.ID < Booking_events.Created_by

// Quan hệ Dịch vụ Bán lẻ
Employees.ID < Service_orders.Created_by
Service_orders.ID < Service_order_items.Service_order_ID
Products.ID < Service_order_items.Product_ID

// Quan hệ Sự cố
Equipments.ID < Incident_reports.Equipment_ID
Bookings.ID < Incident_reports.Booking_ID
Employees.ID < Incident_reports.Approved_by
Employees.ID < Incident_reports.Created_by 

---

# Mini Football Field Management System — System Architecture & Design Specification
## 1. Scope and architecture
The existing **Mini Football Field Management Architecture** diagram is the architectural reference for this specification. It separates **Role-based interfaces**, **Business constants · single source of truth**, **Java Spring Boot · authenticated REST API · transactional domain services**, and **SQL Server · 15-table transactional persistence**. This document specifies their implementation without replacing or modifying the existing workspace ERD.

| Concern | Design |
| ----- | ----- |
| Facility | <p>12 fields; operating hours </p><p>**07:00–24:00**</p><p> each service day</p> |
| Application | Java Spring Boot authenticated REST API, domain services, JPA/JDBC, SQL transactions |
| Persistence | SQL Server; exactly 15 application tables specified below |
| Staff · Receptionist | Operational rights: bookings, check-in, payments, POS, and incident reporting |
| Manager / Owner | Full administrative rights, including pricing, inventory, staff, reports, and audit review |
| Customers | No customer accounts. A unique phone number identifies a transparent CRM profile. |
| Monetary values | VND; persist as `DECIMAL(18,2)`, never floating point |
| Time | REST uses ISO 8601 timestamps with offsets. Booking boundaries use SQL Server `DATETIME2(7)` in the configured facility time zone; audit timestamps use UTC `DATETIME2(7)`. |
A booking occupies a half-open interval `**[start_at, end_at)**`: one booking may end exactly when another begins. `24:00` is represented as `**00:00**` **on the following calendar date**, never as an invalid SQL time value. A booking must begin no earlier than 07:00 and end no later than the midnight closing that follows its start date. Pricing rules instead use integer minutes from the service-day midnight: `**0–1440**`, with `1440` representing 24:00.

## 2. Phase 0 — Business constants and guard rules
Keep these values in a single versioned policy implementation used by commands, scheduled jobs, and tests. Do not duplicate calculations in controllers or clients.

| Rule | Required behavior |
| ----- | ----- |
| Deposit | <p>**50% of the total booking value at booking confirmation.**</p><p> The server calculates the booking value and deposit; client-supplied amounts are not authoritative.</p> |
| Cancellation refund, remaining time `t ≥ 24h`  | <p>Refund </p><p>**100% of the deposit paid**</p><p>.</p> |
| Cancellation refund, `3h ≤ t < 24h`  | <p>Refund </p><p>**40% of the deposit paid**</p><p>; retain the other 60%.</p> |
| Cancellation refund, `t < 3h`  | <p>Refund </p><p>**0%**</p><p>; retain the entire deposit as revenue.</p> |
| Time change | <p>Permit only when </p><p>**at least 3 hours remain before the current booking start**</p><p>. Revalidate availability and pricing transactionally.</p> |
| Overtime eligibility | Booking must be `**IN_PROGRESS**` and the request must occur **from 20 minutes before its current end until, but not including, its current end**. |
| Overtime charge | **50,000 VND per 30-minute block**. Charge `ceil(requested_extension_minutes / 30)` blocks; requested duration must be positive. |
| Not attend | If the customer has not arrived **more than 20 minutes after start**, transition to `**NOT_ATTEND**`, retain **100% of the deposit**, and increment `Customers.all_time_boom` once. |
| Salary | `total_hours × 40,000 VND`, using recorded work-shift hours. |
### Guard evaluation
- Calculate `t = start_at − decision_time`  at the server, using one transaction-consistent decision timestamp. At exactly 24 hours use the 100% tier; at exactly 3 hours use the 40% tier.
- The not-attend threshold is strict: `decision_time > start_at + 20 minutes` . Check-in and not-attend must compete through the same locked booking row so neither can succeed after the other.
- An overtime request at exactly `end_at − 20 minutes`  qualifies; one at or after `end_at`  does not. The extended end must still respect facility closing and must not overlap another active booking.
- Price the original field interval from applicable `Pricing_rules` , then persist `Bookings.field_amount`  as its snapshot. Persist overtime separately in `Bookings.overtime_amount` ; the current booking value is their sum. Existing snapshots do not change when a pricing rule is edited.
- On a time change, resolve and snapshot the replacement field price and reconcile the resulting deposit obligation against ledger entries. Do not silently overwrite a paid deposit, issue an unspecified refund, or fabricate a payment: post the appropriate financial action and audit event before completing the command.
- Record retained deposit value as a `RETAINED`  ledger entry. It represents a transfer to recognized revenue, **not another cash receipt**. Keep compensation fees for lost or damaged equipment outside the main booking invoice.
## 3. Phase 1 — Physical SQL Server schema
### 3.1 Table inventory and relationships
The **15** tables match the architecture diagram’s five persistence groups.

| Group | Tables | Count |
| ----- | ----- | ----- |
| HR & shifts | `Roles`, `Employees`, `Work_shifts`  | 3 |
| Customer CRM | `Customers`  | 1 |
| Booking, pricing & ledger | `Fields`, `Pricing_rules`, `Bookings`, `Payments`, `Invoices`, `Booking_events`  | 6 |
| POS & stock | `Products`, `Service_orders`, `Service_order_items`  | 3 |
| Equipment & incidents | `Equipments`, `Incident_reports`  | 2 |
| **Total** |  | **15** |
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
```
### 3.3 Migration constraints and transactional invariants
Implement these in SQL Server migrations, in addition to the DBML keys and indexes:

- Seed `Roles.role_code`  with `STAFF`  and `MANAGER` ; authorize by server-side role, not request payload. Seed exactly 12 `Fields`  for this facility. Do not make `Fields`  count a schema constraint that prevents controlled facility maintenance.
- Add `CHECK`  constraints for positive durations; nonnegative monetary values and counters; `Products.stock >= 0` , `min_stock >= 0` ; positive sale and incident quantities; `day_of_week BETWEEN 1 AND 7` ; and `0 <= start_minute < end_minute <= 1440` . Check `Pricing_rules.rate_per_minute >= 0` .
- Constrain `Bookings.status`  to `PENDING` , `CONFIRMED` , `IN_PROGRESS` , `COMPLETED` , `CANCELLED` , or `NOT_ATTEND` ; `Payments.kind`  to `DEPOSIT` , `REFUND` , `FINAL` , or `RETAINED` ; and incident classification to `LOST`  or `DAMAGED` .
- Normalize a customer phone number before lookup or insertion; enforce its uniqueness at the database boundary. Initialize CRM counters to zero. Calculate shift hours from `Work_shifts`  boundaries, then salary at **40,000 VND/hour**; reject an end not later than its start.
- For every priced minute, resolve exactly one applicable field/day/effective-date pricing rule. Reject gaps or ambiguous overlapping rules during pricing administration and booking validation. Round the final field amount to VND monetary precision and retain its snapshot.
- SQL Server has no native exclusion constraint for time ranges. For a create, time change, or overtime extension, begin a transaction; acquire a transaction-owned `sp_getapplock`  for the affected **field and service date**; then query conflicting `Bookings`  with `UPDLOCK, HOLDLOCK` . Acquire multiple resource locks in deterministic order if needed. Reject when an active booking satisfies `existing.start_at < proposed.end_at AND proposed.start_at < existing.end_at` . `CANCELLED`  and `NOT_ATTEND`  do not reserve a field; `PENDING` , `CONFIRMED` , and `IN_PROGRESS`  do. Keep the check, write, invoice/ledger changes, and event in one transaction.
- Mutate stock with a guarded update (`stock >= quantity` ) inside the service-order transaction. Read `current_unit_price`  there and snapshot it in `Service_order_items.unit_price` ; flag `stock <= min_stock` .
- Use the unique `Payments.idempotency_key`  to prevent repeated financial postings. Use `Bookings.row_version`  or an equivalent conditional update to reject stale state changes.
## 4. Phase 2 — Booking lifecycle
The architecture diagram’s states are `**PENDING → CONFIRMED → IN_PROGRESS → (COMPLETED | CANCELLED | NOT_ATTEND)**`. The terminal outcomes shown there are subject to the following _strict source-state guards_; in particular, no-show occurs before check-in, not after it.

| From | To | Guard and atomic effects |
| ----- | ----- | ----- |
| New request | `PENDING`  | Valid customer phone, active field, operating-hours interval, unambiguous price, and no overlap. Create booking, one invoice, and creation event. |
| `PENDING`  | `CONFIRMED`  | Required **50% deposit** has been recorded as a `DEPOSIT` payment. Record status event. |
| `CONFIRMED`  | `IN_PROGRESS`  | Staff checks the customer in; the booking has not already qualified and transitioned to `NOT_ATTEND`. Record status event. |
| `IN_PROGRESS`  | `COMPLETED`  | Play has ended; reconcile the final balance through `FINAL` payment entries as applicable and record status event. Increment `all_time_success` once. |
| `PENDING` or `CONFIRMED`  | `CANCELLED`  | Determine refund tier from remaining time; post any `REFUND` and `RETAINED` entries against deposit actually paid. Release availability, record event, increment `all_time_cancel` once. An unpaid `PENDING` booking has no deposit to refund or retain. |
| `CONFIRMED`  | `NOT_ATTEND`  | No check-in and server time **strictly later** than start plus 20 minutes. Post a `RETAINED` entry for the entire paid deposit, release availability, record event, increment `all_time_boom` once. |
`COMPLETED`, `CANCELLED`, and `NOT_ATTEND` are terminal. Ordinary cancellation or no-show must not transition an `IN_PROGRESS` booking; any exceptional termination requires a separately specified administrative financial policy rather than reuse of the pre-start refund rules.

**In-place commands that do not change state:**

- **Time change:** only on `PENDING`  or `CONFIRMED` , with `decision_time <= current start_at − 3 hours` . Recheck operating hours, pricing, overlap, and financial obligations; write old/new boundaries to `Booking_events` . A failed guard leaves all data unchanged.
- **Overtime:** only on `IN_PROGRESS` , within `[current end_at − 20 minutes, current end_at)` . Lock and recheck the booking and field schedule, calculate charge at **50,000 VND per 30-minute block**, advance `end_at` , increase `overtime_amount` , update the invoice and balance, and log old/new end times and charge in `Booking_events` . Reject extension beyond midnight closing or into another booking.
- **Scheduled not-attend processing:** scan eligible `CONFIRMED`  bookings, but recheck eligibility under a row lock before transitioning. The same idempotent transaction updates ledger, event, and CRM counter.
## 5. Phase 3 — REST API contracts
All endpoints are authenticated. Staff can execute operational endpoints; Manager / Owner additionally administers pricing, inventory, employees, shifts, and audit/report access. Customer phone data is handled through staff workflows, **not customer logins**. JSON timestamps below include a facility-local offset; persist converted booking boundaries as `DATETIME2(7)`.

### 5.1 Check real-time availability
```http
GET /availability?startAt=2026-10-03T20:00:00%2B07:00&endAt=2026-10-03T21:00:00%2B07:00
Authorization: Bearer <token>
```
```json
{
  "startAt": "2026-10-03T20:00:00+07:00",
  "endAt": "2026-10-03T21:00:00+07:00",
  "fields": [
    { "fieldId": 1, "fieldName": "Field 1", "available": true },
    { "fieldId": 2, "fieldName": "Field 2", "available": false }
  ]
}
```
Availability is an informational snapshot, **not a reservation**. Validate facility hours and use the same half-open interval semantics as booking creation.

### 5.2 Create a booking
```http
POST /bookings
Authorization: Bearer <token>
Content-Type: application/json
Idempotency-Key: booking-20261003-1042
```
```json
{
  "fieldId": 1,
  "customer": {
    "phone": "+84901234567",
    "fullName": "Nguyen Van A"
  },
  "startAt": "2026-10-03T20:00:00+07:00",
  "endAt": "2026-10-03T21:00:00+07:00"
}
```
```http
HTTP/1.1 201 Created
Location: /bookings/1042
```
```json
{
  "bookingId": 1042,
  "fieldId": 1,
  "customerId": 301,
  "status": "PENDING",
  "startAt": "2026-10-03T20:00:00+07:00",
  "endAt": "2026-10-03T21:00:00+07:00",
  "fieldAmount": 400000.00,
  "overtimeAmount": 0.00,
  "bookingTotal": 400000.00,
  "depositDue": 200000.00,
  "invoiceId": 5042
}
```
The amounts illustrate a resolved price; they are not a new fixed field rate. Look up or create `Customers` by normalized unique phone. Perform the overlap check and insertion in the transaction described in §3.3. If another active booking wins the race, return **HTTP 409 Conflict**, never a second reservation:

```http
HTTP/1.1 409 Conflict
Content-Type: application/json
```
```json
{
  "code": "FIELD_TIME_CONFLICT",
  "message": "The selected field is unavailable for this interval.",
  "fieldId": 1,
  "requestedStartAt": "2026-10-03T20:00:00+07:00",
  "requestedEndAt": "2026-10-03T21:00:00+07:00"
}
```
Record the 50% deposit through the payment workflow before transitioning to `CONFIRMED`; creating a `PENDING` booking does not imply that cash was received.

### 5.3 Process an overtime extension
```http
POST /bookings/1042/extensions
Authorization: Bearer <token>
Content-Type: application/json
Idempotency-Key: extension-1042-1
```
```json
{
  "expectedEndAt": "2026-10-03T21:00:00+07:00",
  "extensionMinutes": 30
}
```
For this example the request must reach the server at or after **20:40** and before **21:00** facility-local time, while booking `1042` is `IN_PROGRESS`.

```json
{
  "bookingId": 1042,
  "status": "IN_PROGRESS",
  "previousEndAt": "2026-10-03T21:00:00+07:00",
  "endAt": "2026-10-03T21:30:00+07:00",
  "extensionBlocks": 1,
  "extensionCharge": 50000.00,
  "overtimeAmount": 50000.00,
  "bookingTotal": 450000.00
}
```
Compare `expectedEndAt` with the locked current end to prevent stale extensions. Return `409 FIELD_TIME_CONFLICT` for an overlap; return `409 STALE_BOOKING_STATE` if the expected end or lifecycle state no longer matches. Return `422 RULE_VIOLATION` for a request outside the overtime window or operating hours. Do not change the original deposit ledger entry when adding an overtime charge; reconcile the additional amount in the final balance.

### 5.4 Report lost or damaged equipment
```http
POST /incidents
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "bookingId": 1042,
  "equipmentId": 17,
  "classification": "DAMAGED",
  "quantity": 1,
  "description": "Damaged training bib",
  "compensationFee": 80000.00
}
```
```http
HTTP/1.1 201 Created
```
```json
{
  "reportId": 902,
  "bookingId": 1042,
  "equipmentId": 17,
  "classification": "DAMAGED",
  "quantity": 1,
  "compensationFee": 80000.00,
  "includedInBookingInvoice": false
}
```
The server attributes the report to the authenticated employee. Validate equipment and booking references. Track and settle compensation separately; do not add `compensationFee` to `Invoices.booking_total`.

### 5.5 Supporting operational contracts
Implement these commands with the same authentication, row-locking, idempotency, and event conventions:

| Endpoint | Purpose |
| ----- | ----- |
| `POST /bookings/{id}/payments`  | Record a `DEPOSIT` or `FINAL` receipt; transition `PENDING` to `CONFIRMED` only once the required deposit is recorded. Refund and retained ledger postings are server-calculated cancellation/no-show effects. |
| `POST /bookings/{id}/check-in`  | Guarded `CONFIRMED → IN_PROGRESS` transition. |
| `PATCH /bookings/{id}/time`  | Request new `startAt` and `endAt`; enforce the **≥3-hour** time-change rule and transactional overlap check. |
| `POST /bookings/{id}/cancel`  | Apply the remaining-time refund tier and transition to `CANCELLED`. |
| `POST /bookings/{id}/complete`  | Reconcile balance and transition `IN_PROGRESS → COMPLETED`. |
| `GET /bookings/{id}/events`  | Retrieve time changes, extensions, and status history; audit review is available to Manager / Owner. |
Use `400` for malformed input, `401` for unauthenticated requests, `403` for insufficient role rights, `404` for an unknown resource, `409` for concurrency/state conflicts, and `422` for a well-formed request that violates a business guard. Never rely on a preceding `GET /availability` to justify a later write.

## 6. Developer implementation guidance
- Separate authenticated controllers from **Booking & real-time availability**, **Pricing & guard rules**, **Phone-number-centric CRM**, **Payment ledger & invoices**, **POS sales & inventory**, **Equipment & incident reports**, **Staff, roles & shifts**, and **Booking events & audit** domain services, following the architecture diagram.
- Centralize transition authorization and policy calculations in domain services. Run each booking command inside one database transaction and write its `Booking_events`  record with the state or time mutation.
- Derive balances from the append-only `Payments`  ledger and reconcile them with `Invoices` . Never edit historical payment amounts or unit-price snapshots. Distinguish `RETAINED`  revenue recognition from cash received.
- Make retries safe: require idempotency keys on money-moving and extension commands; use optimistic version checks or locked-row comparisons for competing staff actions. Log authenticated employee identity and UTC event time.
- Test all threshold boundaries explicitly: 24 hours, 3 hours, exactly and just over 20 minutes after start, exactly 20 minutes before end, and the end instant itself. Include midnight closing, pricing minute `1440` , adjacent non-overlapping bookings, concurrent attempts for the same field, repeated scheduled no-show runs, and repeated payment requests.
- Monitor overlap conflicts, failed financial reconciliation, pricing gaps, low stock, and scheduled not-attend processing. Restrict access to phone numbers and audit sensitive actions under the role model.


