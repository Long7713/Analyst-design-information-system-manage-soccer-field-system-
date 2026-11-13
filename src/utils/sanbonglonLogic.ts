/**
 * SANBONGLON – Pure Business & Operational Logic
 * Decoupled logic for schedule timeline calculations, booking mutations, POS pricing, and boom risk.
 */

export type BookingStatus = 'checked-in' | 'confirmed' | 'pending' | 'boom' | 'cancelled';

export interface BookingOrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
}

export interface PitchBooking {
  id: string;
  pitchId: string; // 'Sân 01' .. 'Sân 12'
  customerName: string;
  teamName: string;
  phone: string;
  date: string;
  startHour: number; // e.g., 17.5 for 17:30, range 7..24
  durationHours: number; // e.g., 1.5
  pitchPrice: number; // Tiền sân ban đầu T (không đổi khi thêm giờ)
  overtimeAmount?: number; // Phụ phí thêm giờ, tách khỏi T (báo cáo: overtime_amount)
  depositPaid: number;
  status: BookingStatus;
  notes?: string;
  posItems: BookingOrderItem[];
}

export const OPERATING_START_HOUR = 7;
export const OPERATING_END_HOUR = 24;
export const TOTAL_OPERATING_HOURS = OPERATING_END_HOUR - OPERATING_START_HOUR; // 17 hours

/**
 * Chính sách thêm giờ (báo cáo BR17): mỗi lượt là 30 phút, giá 50.000 đ/30 phút.
 * Chỉ nhận bội số của 30 phút vì quy tắc phần lẻ chưa chốt, không tự làm tròn để thu.
 */
export const EXTRA_SLOT_HOURS = 0.5;
export const EXTRA_PRICE_PER_SLOT = 50000;

/**
 * Giá thuê sân thường (vd 300.000 đ/giờ) đi vào tiền sân T qua calculatePitchPrice.
 * Giá thêm giờ 50.000 đ/30 phút là giá riêng, CHỈ áp dụng khi sân đang đá.
 */
export function isBookingPlaying(booking: Pick<PitchBooking, 'status'>): boolean {
  return booking.status === 'checked-in';
}

/** Có được tính giá thêm giờ 50.000 đ/30 phút cho phiếu này không (chỉ khi đang đá). */
export function canApplyOvertimeRate(booking: Pick<PitchBooking, 'status'>): boolean {
  return isBookingPlaying(booking);
}

/**
 * Phụ phí thêm giờ cho `addedHours` giờ. Không đang đá -> 0 (không được tính giá thêm giờ).
 */
export function calculateOvertimeFee(
  booking: Pick<PitchBooking, 'status'>,
  addedHours: number
): number {
  if (!canApplyOvertimeRate(booking) || addedHours <= 0) return 0;
  return Math.round((addedHours / EXTRA_SLOT_HOURS) * EXTRA_PRICE_PER_SLOT);
}

/** Mọi mốc giờ bắt đầu hợp lệ trên timeline: 07:00, 07:30, ... 23:30. */
export const START_HOUR_OPTIONS: number[] = Array.from(
  { length: TOTAL_OPERATING_HOURS * 2 },
  (_, i) => OPERATING_START_HOUR + i * 0.5
);

/** Kéo giờ bắt đầu về mốc gần nhất sao cho ca đá vẫn kết thúc trước giờ đóng cửa. */
export function clampStartHour(startHour: number, durationHours: number): number {
  const latest = OPERATING_END_HOUR - durationHours;
  const clamped = Math.max(OPERATING_START_HOUR, Math.min(latest, startHour));
  return Math.floor(clamped * 2) / 2;
}

/** Số giờ của phiếu nằm trong khoảng [from, to). */
export function bookingOverlapHours(
  booking: Pick<PitchBooking, 'startHour' | 'durationHours'>,
  from: number,
  to: number
): number {
  const start = Math.max(booking.startHour, from);
  const end = Math.min(booking.startHour + booking.durationHours, to);
  return Math.max(0, end - start);
}

/** % lấp đầy của `pitchCount` sân trong khung [from, to), bỏ qua phiếu hủy và boom. */
export function occupancyPercent(
  bookings: PitchBooking[],
  from: number,
  to: number,
  pitchCount: number
): number {
  const capacity = pitchCount * (to - from);
  if (capacity <= 0) return 0;
  const booked = bookings
    .filter((b) => b.status !== 'cancelled' && b.status !== 'boom')
    .reduce((sum, b) => sum + bookingOverlapHours(b, from, to), 0);
  return Math.min(100, (booked / capacity) * 100);
}

/**
 * Giá sân tính theo từng nửa giờ: trước 16:00 giá ban ngày, 16:00–21:30 giờ vàng,
 * từ 21:30 giá giờ muộn. Ca vắt qua nhiều khung sẽ tính đúng từng khung.
 */
export function calculatePitchPrice(
  rates: { baseRateMorning: number; baseRatePrime: number; baseRateLate: number },
  startHour: number,
  durationHours: number
): number {
  let total = 0;
  for (let t = startHour; t < startHour + durationHours - 1e-9; t += 0.5) {
    const slotLen = Math.min(0.5, startHour + durationHours - t);
    const rate = t < 16 ? rates.baseRateMorning : t < 21.5 ? rates.baseRatePrime : rates.baseRateLate;
    total += rate * slotLen;
  }
  return Math.round(total);
}

export function formatHourLabel(hourFloat: number): string {
  const hours = Math.floor(hourFloat);
  const mins = Math.round((hourFloat - hours) * 60);
  const hh = String(hours).padStart(2, '0');
  const mm = String(mins).padStart(2, '0');
  return `${hh}:${mm}`;
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount)) + ' đ';
}

export function calculateTimelinePosition(startHour: number, durationHours: number): {
  leftPercent: number;
  widthPercent: number;
} {
  const clampedStart = Math.max(OPERATING_START_HOUR, Math.min(OPERATING_END_HOUR, startHour));
  const clampedEnd = Math.max(
    clampedStart,
    Math.min(OPERATING_END_HOUR, startHour + Math.max(0.5, durationHours))
  );

  const leftPercent = ((clampedStart - OPERATING_START_HOUR) / TOTAL_OPERATING_HOURS) * 100;
  const widthPercent = ((clampedEnd - clampedStart) / TOTAL_OPERATING_HOURS) * 100;

  return {
    leftPercent: Number(leftPercent.toFixed(4)),
    widthPercent: Number(widthPercent.toFixed(4)),
  };
}

export function calculateBookingFinancials(
  booking: Pick<PitchBooking, 'pitchPrice' | 'depositPaid' | 'posItems'> & { overtimeAmount?: number }
): {
  pitchTotal: number;
  overtimeTotal: number;
  posTotal: number;
  grandTotal: number;
  remainingBalance: number;
} {
  const pitchTotal = Math.max(0, booking.pitchPrice);
  const posTotal = booking.posItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const overtimeTotal = Math.max(0, booking.overtimeAmount ?? 0);
  // Đơn cuối = tiền sân + thêm giờ. Tiền dịch vụ/POS tách riêng, thanh toán riêng, không cộng vào đơn.
  const grandTotal = pitchTotal + overtimeTotal;
  const remainingBalance = Math.max(0, grandTotal - booking.depositPaid);

  return {
    pitchTotal,
    overtimeTotal,
    posTotal,
    grandTotal,
    remainingBalance,
  };
}

export function hasBookingConflict(
  existingBookings: PitchBooking[],
  candidate: {
    id?: string;
    pitchId: string;
    date: string;
    startHour: number;
    durationHours: number;
  }
): boolean {
  const candStart = candidate.startHour;
  const candEnd = candidate.startHour + candidate.durationHours;

  return existingBookings.some((b) => {
    if (b.id === candidate.id) return false;
    if (b.pitchId !== candidate.pitchId || b.date !== candidate.date) return false;
    if (b.status === 'cancelled' || b.status === 'boom') return false;

    const bStart = b.startHour;
    const bEnd = b.startHour + b.durationHours;

    return candStart < bEnd && candEnd > bStart;
  });
}

/** BR07: khách chỉ chọn cọc 50% hoặc 100% tiền sân T, hoặc chưa nộp (chờ cọc). Không nhập số tùy ý. */
export type DepositMode = 'pending' | 'half' | 'full';

export function depositAmountFor(pitchPrice: number, mode: DepositMode): number {
  if (mode === 'pending') return 0;
  return Math.round(mode === 'half' ? pitchPrice * 0.5 : pitchPrice);
}

export type BookingAction = 'nhan-san' | 'them-gio' | 'doi-gio' | 'bao-boom' | 'huy-san';

/**
 * Điều kiện trạng thái theo báo cáo (UC02, UC03, UC04, UC08 / BR10, BR11, BR17).
 * Trả về lý do từ chối, hoặc null nếu thao tác được phép.
 */
export function getActionBlockReason(
  booking: Pick<PitchBooking, 'status'>,
  action: BookingAction
): string | null {
  const s = booking.status;
  switch (action) {
    case 'nhan-san':
      if (s === 'confirmed') return null;
      if (s === 'pending') return 'Đơn đang chờ cọc: cần xác nhận cọc trước khi nhận sân.';
      if (s === 'checked-in') return 'Đơn đã nhận sân trước đó.';
      return 'Đơn đã hủy hoặc khách không đến, không thể nhận sân.';
    case 'them-gio':
      return canApplyOvertimeRate(booking) ? null : 'Chỉ thêm giờ được cho đơn đang đá (đã nhận sân).';
    case 'bao-boom':
      return s === 'confirmed' ? null : 'Chỉ ghi nhận vắng mặt cho đơn đã xác nhận và chưa nhận sân.';
    case 'huy-san':
      return s === 'pending' || s === 'confirmed'
        ? null
        : 'Đơn đang đá, đã hủy hoặc khách không đến: không thể hủy.';
    default:
      return null;
  }
}

export function applyBookingAction(
  booking: PitchBooking,
  action: BookingAction,
  payload?: { newStartHour?: number; extraHours?: number }
): PitchBooking {
  if (getActionBlockReason(booking, action) !== null) return booking;

  switch (action) {
    case 'nhan-san':
      return { ...booking, status: 'checked-in' };

    case 'them-gio': {
      const addHours = payload?.extraHours ?? EXTRA_SLOT_HOURS;
      // Thêm giờ tối thiểu 0,5h và phải là bội số của 0,5h; ngoài ra giữ nguyên phiếu.
      if (addHours < EXTRA_SLOT_HOURS || (addHours / EXTRA_SLOT_HOURS) % 1 !== 0) {
        return booking;
      }
      const nextDuration = Math.min(OPERATING_END_HOUR - booking.startHour, booking.durationHours + addHours);
      const actualAdded = Math.max(0, nextDuration - booking.durationHours);
      return {
        ...booking,
        durationHours: nextDuration,
        // Phụ phí thêm giờ ghi riêng, không cộng vào tiền sân ban đầu T.
        overtimeAmount: (booking.overtimeAmount ?? 0) + calculateOvertimeFee(booking, actualAdded),
      };
    }

    case 'doi-gio': {
      const nextStart =
        payload?.newStartHour !== undefined
          ? Math.max(OPERATING_START_HOUR, Math.min(OPERATING_END_HOUR - booking.durationHours, payload.newStartHour))
          : booking.startHour;
      return {
        ...booking,
        startHour: nextStart,
      };
    }

    case 'bao-boom':
      return { ...booking, status: 'boom' };

    case 'huy-san':
      return { ...booking, status: 'cancelled' };

    default:
      return booking;
  }
}

export function classifyCustomerRisk(totalBookings: number, boomCount: number): {
  level: 'an-toan' | 'canh-bao' | 'rui-ro-cao';
  label: string;
} {
  if (boomCount >= 2 || (totalBookings > 0 && boomCount / totalBookings >= 0.25)) {
    return { level: 'rui-ro-cao', label: 'Cảnh báo Boom' };
  }
  if (boomCount === 1) {
    return { level: 'canh-bao', label: 'Lưu ý' };
  }
  return { level: 'an-toan', label: 'Uy tín tốt' };
}
