import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatHourLabel,
  calculateTimelinePosition,
  calculateBookingFinancials,
  hasBookingConflict,
  applyBookingAction,
  classifyCustomerRisk,
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

test('applyBookingAction handles Nhận, Thêm giờ, Đổi giờ, Báo boom, and Hủy', () => {
  const base: PitchBooking = {
    id: 'BK-02',
    pitchId: 'Sân 03',
    pitchType: '5 người',
    customerName: 'Trần Quốc Đạt',
    teamName: 'FC Sân Trẻ',
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
