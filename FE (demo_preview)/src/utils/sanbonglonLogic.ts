/**
 * SANBONGLON — Pure Business & Operational Logic
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
  pitchType: '5 người' | '7 người';
  customerName: string;
  teamName: string;
  phone: string;
  date: string;
  startHour: number; // e.g., 17.5 for 17:30, range 7..24
  durationHours: number; // e.g., 1.5
  pitchPrice: number;
  depositPaid: number;
  status: BookingStatus;
  notes?: string;
  posItems: BookingOrderItem[];
}

export const OPERATING_START_HOUR = 7;
export const OPERATING_END_HOUR = 24;
export const TOTAL_OPERATING_HOURS = OPERATING_END_HOUR - OPERATING_START_HOUR; // 17 hours

export function formatHourLabel(hourFloat: number): string {
  const hours = Math.floor(hourFloat);
  const mins = Math.round((hourFloat - hours) * 60);
  const hh = String(hours).padStart(2, '0');
  const mm = String(mins).padStart(2, '0');
  return `${hh}:${mm}`;
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount)) + ' ₫';
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

export function calculateBookingFinancials(booking: Pick<PitchBooking, 'pitchPrice' | 'depositPaid' | 'posItems'>): {
  pitchTotal: number;
  posTotal: number;
  grandTotal: number;
  remainingBalance: number;
} {
  const pitchTotal = Math.max(0, booking.pitchPrice);
  const posTotal = booking.posItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const grandTotal = pitchTotal + posTotal;
  const remainingBalance = Math.max(0, grandTotal - booking.depositPaid);
  return {
    pitchTotal,
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

export function applyBookingAction(
  booking: PitchBooking,
  action: 'nhan-san' | 'them-gio' | 'doi-gio' | 'bao-boom' | 'huy-san',
  payload?: { newStartHour?: number; extraHours?: number; extraRatePerHour?: number }
): PitchBooking {
  switch (action) {
    case 'nhan-san':
      return { ...booking, status: 'checked-in' };
    case 'them-gio': {
      const addHours = payload?.extraHours ?? 0.5;
      const rate = payload?.extraRatePerHour ?? 300000;
      const nextDuration = Math.min(OPERATING_END_HOUR - booking.startHour, booking.durationHours + addHours);
      const actualAdded = Math.max(0, nextDuration - booking.durationHours);
      return {
        ...booking,
        durationHours: nextDuration,
        pitchPrice: booking.pitchPrice + Math.round(actualAdded * rate),
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
    return { level: 'canh-bao', label: 'Lưu ý đặt cọc' };
  }
  return { level: 'an-toan', label: 'Uy tín tốt' };
}
