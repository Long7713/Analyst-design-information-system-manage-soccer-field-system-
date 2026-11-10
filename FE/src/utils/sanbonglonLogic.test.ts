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
  assert.equal(result.posTotal, 90000);
  assert.equal(result.grandTotal, 540000);
  assert.equal(result.remainingBalance, 390000);
});

test('hasBookingConflict detects overlapping active slots on the same pitch', () => {
  const sampleBookings: PitchBooking[] = [
    {
      id: 'BK-01',
      pitchId: 'Sân 01',
      pitchType: '5 người',
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
    pitchType: '5 người',
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

  const extended = applyBookingAction(base, 'them-gio', { extraHours: 0.5, extraRatePerHour: 300000 });
  assert.equal(extended.durationHours, 2.0);
  assert.equal(extended.pitchPrice, 600000);

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
  id: 'T1', pitchId: 'Sân 01', pitchType: '5 người', customerName: 'a', teamName: 't', phone: '1',
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
  const a = mk({ id: 'A', startHour: 17.5, durationHours: 1.5 });
  const b = mk({ id: 'B', startHour: 19.5 });
  let extended = applyBookingAction(a, 'them-gio', { extraHours: 0.5 });
  assert.equal(hasBookingConflict([b], { ...extended }), false); // 17:30-19:30 vừa chạm, chưa đè
  extended = applyBookingAction(extended, 'them-gio', { extraHours: 0.5 });
  assert.equal(hasBookingConflict([b], { ...extended }), true); // 17:30-20:00 đè lên B
});

test('reviving a boom booking is a conflict once the slot was rebooked', () => {
  const boom = mk({ id: 'BOOM', status: 'boom' });
  const rebooked = mk({ id: 'NEW' });
  const revived = applyBookingAction(boom, 'nhan-san');
  assert.equal(hasBookingConflict([rebooked], { ...revived }), true);
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
