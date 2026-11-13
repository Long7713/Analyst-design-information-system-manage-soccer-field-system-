import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatHourLabel,
  calculateTimelinePosition,
  calculateBookingFinancials,
  hasBookingConflict,
  applyBookingAction,
  classifyCustomerRisk,
  START_HOUR_OPTIONS,
  EXTRA_PRICE_PER_SLOT,
  depositAmountFor,
  getActionBlockReason,
  isBookingPlaying,
  calculateOvertimeFee,
  clampStartHour,
  calculatePitchPrice,
  occupancyPercent,
  type PitchBooking,
} from './sanbonglonLogic.ts';

test('formatHourLabel formats integer and half hours accurately', () => {
  assert.equal(formatHourLabel(7), '07:00');
  assert.equal(formatHourLabel(17.5), '17:30');
  assert.equal(formatHourLabel(24), '24:00');
});

test('calculateTimelinePosition maps 07:00-24:00 (17h window) to percentages', () => {
  const posStart = calculateTimelinePosition(7, 1.7);
  assert.equal(posStart.leftPercent, 0);
  assert.equal(posStart.widthPercent, 10);

  const posEvening = calculateTimelinePosition(15.5, 1.7);
  assert.equal(posEvening.leftPercent, 50);
  assert.equal(posEvening.widthPercent, 10);
});

test('calculateBookingFinancials computes pitch + POS items and remaining balance', () => {
  const result = calculateBookingFinancials({
    pitchPrice: 450000,
    depositPaid: 150000,
    posItems: [
      { productId: 'p1', name: 'Nước suối Aquafina', price: 10000, qty: 6 },
      { productId: 'p2', name: 'Thuê áo Bib', price: 30000, qty: 1 },
    ],
  });
  assert.equal(result.pitchTotal, 450000);
  assert.equal(result.posTotal, 90000); // dịch vụ tách riêng
  assert.equal(result.grandTotal, 450000); // đơn cuối không gồm dịch vụ
  assert.equal(result.remainingBalance, 300000);
});

test('hasBookingConflict detects overlapping active slots on the same pitch', () => {
  const sampleBookings: PitchBooking[] = [
    {
      id: 'BK-01',
      pitchId: 'Sân 01',
      customerName: 'Nguyễn Minh Tuấn',
      teamName: 'FC Bình Thạnh',
      phone: '0909123456',
      date: '2026-10-17',
      startHour: 17.5,
      durationHours: 1.5,
      pitchPrice: 450000,
      depositPaid: 200000,
      status: 'confirmed',
      posItems: [],
    },
  ];

  assert.equal(
    hasBookingConflict(sampleBookings, {
      pitchId: 'Sân 01',
      date: '2026-10-17',
      startHour: 18,
      durationHours: 1.5,
    }),
    true
  );

  assert.equal(
    hasBookingConflict(sampleBookings, {
      pitchId: 'Sân 01',
      date: '2026-10-17',
      startHour: 19,
      durationHours: 1.5,
    }),
    false
  );
});

test('applyBookingAction handles Nhận, Thêm giờ, Đổi giờ, Báo boom, and Hủy sân', () => {
  const base: PitchBooking = {
    id: 'BK-02',
    pitchId: 'Sân 03',
    customerName: 'Trần Quốc Bảo',
    teamName: 'FC Sơn Trà',
    phone: '0918222333',
    date: '2026-10-17',
    startHour: 18,
    durationHours: 1.5,
    pitchPrice: 450000,
    depositPaid: 150000,
    status: 'confirmed',
    posItems: [],
  };

  const checkedIn = applyBookingAction(base, 'nhan-san');
  assert.equal(checkedIn.status, 'checked-in');

  // Thêm giờ chỉ áp dụng cho đơn đang đá; phụ phí ghi riêng, tiền sân ban đầu T giữ nguyên.
  assert.equal(applyBookingAction(base, 'them-gio', { extraHours: 0.5 }).durationHours, base.durationHours);
  const extended = applyBookingAction(checkedIn, 'them-gio', { extraHours: 0.5 });
  assert.equal(extended.durationHours, 2.0);
  assert.equal(extended.pitchPrice, 450000);
  assert.equal(extended.overtimeAmount, 50000); // 50.000 cho 30 phút thêm (BR17)

  const rescheduled = applyBookingAction(base, 'doi-gio', { newStartHour: 19.5 });
  assert.equal(rescheduled.startHour, 19.5);

  const boomed = applyBookingAction(base, 'bao-boom');
  assert.equal(boomed.status, 'boom');

  const cancelled = applyBookingAction(base, 'huy-san');
  assert.equal(cancelled.status, 'cancelled');
});

test('classifyCustomerRisk identifies high boom risk accurately', () => {
  assert.equal(classifyCustomerRisk(12, 0).level, 'an-toan');
  assert.equal(classifyCustomerRisk(8, 1).level, 'canh-bao');
  assert.equal(classifyCustomerRisk(5, 2).level, 'rui-ro-cao');
});

const mk = (o: Partial<PitchBooking>): PitchBooking => ({
  id: 'T1', pitchId: 'Sân 01', customerName: 'a', teamName: 't', phone: '1',
  date: '2026-10-17', startHour: 17.5, durationHours: 1.5, pitchPrice: 0, depositPaid: 0,
  status: 'confirmed', posItems: [], ...o,
});

test('START_HOUR_OPTIONS covers every timeline hour (11h, 12h, 13h, 23h included)', () => {
  for (const h of [7, 11, 12, 13, 23]) assert.ok(START_HOUR_OPTIONS.includes(h), `missing ${h}`);
});

test('clampStartHour keeps the match inside opening hours', () => {
  assert.equal(clampStartHour(23, 1.5), 22.5);
  assert.equal(clampStartHour(12, 1.5), 12);
  assert.equal(clampStartHour(5, 1), 7);
});

test('extending a booking into the next one is detected as a conflict', () => {
  const a = mk({ id: 'A', startHour: 17.5, durationHours: 1.5, status: 'checked-in' });
  const b = mk({ id: 'B', startHour: 19.5 });
  let extended = applyBookingAction(a, 'them-gio', { extraHours: 0.5 });
  assert.equal(hasBookingConflict([b], { ...extended }), false); // 17:30-19:30 vừa chạm, chưa đè
  extended = applyBookingAction(extended, 'them-gio', { extraHours: 0.5 });
  assert.equal(hasBookingConflict([b], { ...extended }), true); // 17:30-20:00 đè lên B
});

test('nhan-san only works on confirmed bookings (BR10, UC08): no reviving boom/cancelled/pending', () => {
  for (const status of ['boom', 'cancelled', 'pending', 'checked-in'] as const) {
    const b = mk({ status });
    assert.equal(applyBookingAction(b, 'nhan-san').status, status, `status=${status}`);
    assert.notEqual(getActionBlockReason(b, 'nhan-san'), null, `status=${status}`);
  }
  assert.equal(applyBookingAction(mk({ status: 'confirmed' }), 'nhan-san').status, 'checked-in');
});

test('bao-boom only for confirmed, huy-san only for pending/confirmed (UC02 E2, UC04)', () => {
  assert.equal(applyBookingAction(mk({ status: 'confirmed' }), 'bao-boom').status, 'boom');
  for (const status of ['pending', 'checked-in', 'cancelled', 'boom'] as const) {
    assert.equal(applyBookingAction(mk({ status }), 'bao-boom').status, status);
  }
  assert.equal(applyBookingAction(mk({ status: 'pending' }), 'huy-san').status, 'cancelled');
  assert.equal(applyBookingAction(mk({ status: 'confirmed' }), 'huy-san').status, 'cancelled');
  for (const status of ['checked-in', 'cancelled', 'boom'] as const) {
    assert.equal(applyBookingAction(mk({ status }), 'huy-san').status, status);
  }
});

test('deposit is only 50% or 100% of T, or none when waiting for deposit (BR07)', () => {
  assert.equal(depositAmountFor(1000000, 'half'), 500000);
  assert.equal(depositAmountFor(1000000, 'full'), 1000000);
  assert.equal(depositAmountFor(1000000, 'pending'), 0);
});

test('paid 100%, overtime 50.000, service 40.000 tách riêng -> remaining 50.000, posTotal 40.000', () => {
  const fin = calculateBookingFinancials({
    pitchPrice: 1000000,
    overtimeAmount: 50000,
    depositPaid: 1000000,
    posItems: [{ productId: 'p1', name: 'Nước', price: 20000, qty: 2 }],
  });
  assert.equal(fin.posTotal, 40000);
  assert.equal(fin.grandTotal, 1050000);
  assert.equal(fin.remainingBalance, 50000);
});

test('isBookingPlaying / calculateOvertimeFee: giá 50.000/30p chỉ khi đang đá', () => {
  assert.equal(isBookingPlaying({ status: 'checked-in' }), true);
  for (const status of ['confirmed', 'pending', 'boom', 'cancelled'] as const) {
    assert.equal(isBookingPlaying({ status }), false, status);
    assert.equal(calculateOvertimeFee({ status }, 0.5), 0, status);
  }
  assert.equal(calculateOvertimeFee({ status: 'checked-in' }, 0.5), 50000);
  assert.equal(calculateOvertimeFee({ status: 'checked-in' }, 1), 100000);
});

test('calculatePitchPrice charges each half-hour in its own price band', () => {
  const rates = { baseRateMorning: 200000, baseRatePrime: 340000, baseRateLate: 260000 };
  assert.equal(calculatePitchPrice(rates, 15, 2), 200000 * 1 + 340000 * 1); // 15-16 sáng, 16-17 vàng
  assert.equal(calculatePitchPrice(rates, 17.5, 1.5), 510000);
  assert.equal(calculatePitchPrice(rates, 21, 1.5), 340000 * 0.5 + 260000 * 1);
});

test('occupancyPercent ignores cancelled and boom bookings', () => {
  const list = [
    mk({ id: '1', startHour: 17, durationHours: 2 }),
    mk({ id: '2', status: 'boom', startHour: 17, durationHours: 2 }),
    mk({ id: '3', status: 'cancelled', startHour: 17, durationHours: 2 }),
  ];
  assert.equal(occupancyPercent(list, 17, 21, 1), 50);
});

test('them-gio charges 50.000 per 30 minutes (BR17) into overtimeAmount, T untouched', () => {
  const b = mk({ pitchPrice: 540000, durationHours: 1.5, startHour: 17.5, status: 'checked-in' });
  assert.equal(EXTRA_PRICE_PER_SLOT, 50000);
  const one = applyBookingAction(b, 'them-gio', { extraHours: 0.5 });
  assert.equal(one.durationHours, 2);
  assert.equal(one.overtimeAmount, 50000);
  assert.equal(one.pitchPrice, 540000);
  const two = applyBookingAction(one, 'them-gio', { extraHours: 1 }); // cộng dồn
  assert.equal(two.durationHours, 3);
  assert.equal(two.overtimeAmount, 150000);
  assert.equal(applyBookingAction(b, 'them-gio').overtimeAmount, 50000); // mặc định 1 lượt
});

test('them-gio rejects amounts under 30 minutes or not a multiple of 30 minutes', () => {
  const b = mk({ pitchPrice: 540000, status: 'checked-in' });
  for (const extraHours of [0.25, 0.4, 0.75, 1.2, 0]) {
    const r = applyBookingAction(b, 'them-gio', { extraHours });
    assert.equal(r.durationHours, b.durationHours, `extraHours=${extraHours}`);
    assert.equal(r.overtimeAmount, b.overtimeAmount, `extraHours=${extraHours}`);
  }
});

test('them-gio never charges for time past closing', () => {
  const b = mk({ startHour: 22.5, durationHours: 1, pitchPrice: 100000, status: 'checked-in' }); // đến 23:30
  const r = applyBookingAction(b, 'them-gio', { extraHours: 1 }); // chỉ còn 30 phút
  assert.equal(r.durationHours, 1.5);
  assert.equal(r.overtimeAmount, 50000); // chỉ tính 30 phút còn lại
});
