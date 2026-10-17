/**
 * SANBONGLON - Comprehensive Vietnamese Operational Demo Dataset
 * 12 pitches (Sân 01 - Sân 12), 07:00 - 24:00 schedule,
 * POS counter items, customer teams & boom tracking, equipment incidents, inventory, staff, revenue, analytics & audit logs.
 */

import { type PitchBooking } from '../utils/sanbonglonLogic';

export interface PitchInfo {
  id: string;
  name: string;
  type: '5 người' | '7 người';
  surface: string;
  lightingStatus: 'Hoạt động tốt' | 'Bảo trì';
  baseRateMorning: number; // 07:00 - 16:00
  baseRatePrime: number;   // 16:00 - 21:30
  baseRateLate: number;    // 21:30 - 24:00
}

export const PITCH_LIST: PitchInfo[] = [
  { id: 'Sân 01', name: 'Sân 01', type: '5 người', surface: 'Cỏ nhân tạo FIFA Pro 50mm', lightingStatus: 'Hoạt động tốt', baseRateMorning: 220000, baseRatePrime: 360000, baseRateLate: 280000 },
  { id: 'Sân 02', name: 'Sân 02', type: '5 người', surface: 'Cỏ nhân tạo FIFA Pro 50mm', lightingStatus: 'Hoạt động tốt', baseRateMorning: 220000, baseRatePrime: 360000, baseRateLate: 280000 },
  { id: 'Sân 03', name: 'Sân 03', type: '5 người', surface: 'Cỏ nhân tạo FIFA Pro 50mm', lightingStatus: 'Hoạt động tốt', baseRateMorning: 220000, baseRatePrime: 360000, baseRateLate: 280000 },
  { id: 'Sân 04', name: 'Sân 04', type: '5 người', surface: 'Cỏ nhân tạo FIFA Pro 50mm', lightingStatus: 'Hoạt động tốt', baseRateMorning: 220000, baseRatePrime: 360000, baseRateLate: 280000 },
  { id: 'Sân 05', name: 'Sân 05', type: '5 người', surface: 'Cỏ sợi kim cương 50mm', lightingStatus: 'Bảo trì', baseRateMorning: 200000, baseRatePrime: 340000, baseRateLate: 260000 },
  { id: 'Sân 06', name: 'Sân 06', type: '5 người', surface: 'Cỏ sợi kim cương 50mm', lightingStatus: 'Hoạt động tốt', baseRateMorning: 200000, baseRatePrime: 340000, baseRateLate: 260000 },
  { id: 'Sân 07', name: 'Sân 07', type: '5 người', surface: 'Cỏ sợi kim cương 50mm', lightingStatus: 'Hoạt động tốt', baseRateMorning: 200000, baseRatePrime: 340000, baseRateLate: 260000 },
  { id: 'Sân 08', name: 'Sân 08', type: '5 người', surface: 'Cỏ sợi kim cương 50mm', lightingStatus: 'Hoạt động tốt', baseRateMorning: 200000, baseRatePrime: 340000, baseRateLate: 260000 },
  { id: 'Sân 09', name: 'Sân 09', type: '7 người', surface: 'Cỏ nhân tạo Cao cấp 60mm', lightingStatus: 'Hoạt động tốt', baseRateMorning: 350000, baseRatePrime: 580000, baseRateLate: 440000 },
  { id: 'Sân 10', name: 'Sân 10', type: '7 người', surface: 'Cỏ nhân tạo Cao cấp 60mm', lightingStatus: 'Hoạt động tốt', baseRateMorning: 350000, baseRatePrime: 580000, baseRateLate: 440000 },
  { id: 'Sân 11', name: 'Sân 11', type: '7 người', surface: 'Cỏ nhân tạo Cao cấp 60mm', lightingStatus: 'Bảo trì', baseRateMorning: 350000, baseRatePrime: 580000, baseRateLate: 440000 },
  { id: 'Sân 12', name: 'Sân 12', type: '7 người', surface: 'Cỏ nhân tạo Cao cấp 60mm', lightingStatus: 'Hoạt động tốt', baseRateMorning: 350000, baseRatePrime: 580000, baseRateLate: 440000 },
];

export const INITIAL_BOOKINGS: PitchBooking[] = [
  {
    id: 'SBL-24101',
    pitchId: 'Sân 01',
    pitchType: '5 người',
    customerName: 'Nguyễn Minh Tuấn',
    teamName: 'FC Bình Thạnh United',
    phone: '0909 412 889',
    date: '2026-10-17',
    startHour: 7.5,
    durationHours: 1.5,
    pitchPrice: 330000,
    depositPaid: 330000,
    status: 'checked-in',
    notes: 'Định kỳ sáng thứ 7, lấy 10 chai suối',
    posItems: [{ productId: 'POS-01', name: 'Nước suối Aquafina 500ml', price: 10000, qty: 10 }],
  },
  {
    id: 'SBL-24102',
    pitchId: 'Sân 01',
    pitchType: '5 người',
    customerName: 'Phạm Gia Huy',
    teamName: 'FC Kiến Trúc Trẻ',
    phone: '0983 115 204',
    date: '2026-10-17',
    startHour: 17.5,
    durationHours: 1.5,
    pitchPrice: 540000,
    depositPaid: 200000,
    status: 'checked-in',
    notes: 'Mượn 1 bộ áo Bib xanh chuối',
    posItems: [
      { productId: 'POS-02', name: 'Revive Chanh Muối', price: 15000, qty: 8 },
      { productId: 'POS-06', name: 'Thuê áo Bib (10 áo)', price: 40000, qty: 1 },
    ],
  },
  {
    id: 'SBL-24103',
    pitchId: 'Sân 01',
    pitchType: '5 người',
    customerName: 'Hoàng Văn Khánh',
    teamName: 'FC Hàng Xanh',
    phone: '0912 778 341',
    date: '2026-10-17',
    startHour: 19.5,
    durationHours: 1.5,
    pitchPrice: 540000,
    depositPaid: 250000,
    status: 'confirmed',
    notes: 'Khách quen cố định tháng',
    posItems: [],
  },
  {
    id: 'SBL-24104',
    pitchId: 'Sân 02',
    pitchType: '5 người',
    customerName: 'Trần Quốc Đạt',
    teamName: 'FC Techcombank Q1',
    phone: '0938 602 911',
    date: '2026-10-17',
    startHour: 16.0,
    durationHours: 1.5,
    pitchPrice: 540000,
    depositPaid: 540000,
    status: 'checked-in',
    notes: 'Xuất phiếu thu nợ công ty',
    posItems: [{ productId: 'POS-04', name: 'Thùng đá + Trà ca lớn', price: 35000, qty: 2 }],
  },
  {
    id: 'SBL-24105',
    pitchId: 'Sân 02',
    pitchType: '5 người',
    customerName: 'Đặng Quốc Việt',
    teamName: 'FC Giản Đơn',
    phone: '0977 339 102',
    date: '2026-10-17',
    startHour: 18.0,
    durationHours: 1.5,
    pitchPrice: 540000,
    depositPaid: 0,
    status: 'pending',
    notes: 'Chưa chuyển khoản cọc trước 17:15',
    posItems: [],
  },
  {
    id: 'SBL-24106',
    pitchId: 'Sân 03',
    pitchType: '5 người',
    customerName: 'Lê Thanh Tùng',
    teamName: 'FC Bách Khoa K18',
    phone: '0903 884 512',
    date: '2026-10-17',
    startHour: 8.5,
    durationHours: 2.0,
    pitchPrice: 440000,
    depositPaid: 440000,
    status: 'checked-in',
    posItems: [{ productId: 'POS-01', name: 'Nước suối Aquafina 500ml', price: 10000, qty: 12 }],
  },
  {
    id: 'SBL-24107',
    pitchId: 'Sân 03',
    pitchType: '5 người',
    customerName: 'Vũ Đình Trọng',
    teamName: 'FC Tự Do Quận 3',
    phone: '0965 901 238',
    date: '2026-10-17',
    startHour: 17.5,
    durationHours: 1.5,
    pitchPrice: 540000,
    depositPaid: 0,
    status: 'boom',
    notes: 'Quá 25 phút không liên lạc được - đã ghi nhận Boom',
    posItems: [],
  },
  {
    id: 'SBL-24108',
    pitchId: 'Sân 04',
    pitchType: '5 người',
    customerName: 'Ngô Quang Huy',
    teamName: 'FC Vạn Phúc',
    phone: '0944 512 900',
    date: '2026-10-17',
    startHour: 18.5,
    durationHours: 1.5,
    pitchPrice: 540000,
    depositPaid: 300000,
    status: 'confirmed',
    posItems: [{ productId: 'POS-05', name: 'Thuê giày Kamito Tuấn Anh', price: 35000, qty: 2 }],
  },
  {
    id: 'SBL-24109',
    pitchId: 'Sân 05',
    pitchType: '5 người',
    customerName: 'Bùi Tiến Dũng',
    teamName: 'FC Viettel Post',
    phone: '0989 201 774',
    date: '2026-10-17',
    startHour: 17.0,
    durationHours: 1.5,
    pitchPrice: 510000,
    depositPaid: 200000,
    status: 'checked-in',
    posItems: [{ productId: 'POS-03', name: 'Pocari Sweat 500ml', price: 20000, qty: 6 }],
  },
  {
    id: 'SBL-24110',
    pitchId: 'Sân 06',
    pitchType: '5 người',
    customerName: 'Đường Đình Dương',
    teamName: 'FC Gia Định',
    phone: '0908 661 290',
    date: '2026-10-17',
    startHour: 19.0,
    durationHours: 2.0,
    pitchPrice: 680000,
    depositPaid: 300000,
    status: 'confirmed',
    posItems: [],
  },
  {
    id: 'SBL-24111',
    pitchId: 'Sân 07',
    pitchType: '5 người',
    customerName: 'Phan Văn Đức',
    teamName: 'FC Nghệ Tĩnh SG',
    phone: '0919 405 118',
    date: '2026-10-17',
    startHour: 20.5,
    durationHours: 1.5,
    pitchPrice: 510000,
    depositPaid: 200000,
    status: 'confirmed',
    posItems: [],
  },
  {
    id: 'SBL-24112',
    pitchId: 'Sân 08',
    pitchType: '5 người',
    customerName: 'Lương Xuân Trường',
    teamName: 'FC Phú Nhuận',
    phone: '0932 710 884',
    date: '2026-10-17',
    startHour: 18.0,
    durationHours: 1.5,
    pitchPrice: 510000,
    depositPaid: 510000,
    status: 'checked-in',
    posItems: [{ productId: 'POS-02', name: 'Revive Chanh Muối', price: 15000, qty: 10 }],
  },
  {
    id: 'SBL-24113',
    pitchId: 'Sân 09',
    pitchType: '7 người',
    customerName: 'Nguyễn Công Phượng',
    teamName: 'FC Doanh Nhân Trẻ',
    phone: '0901 999 456',
    date: '2026-10-17',
    startHour: 17.5,
    durationHours: 1.5,
    pitchPrice: 870000,
    depositPaid: 500000,
    status: 'checked-in',
    notes: 'Có thuê trọng tài điều khiển trận giao hữu',
    posItems: [
      { productId: 'POS-03', name: 'Pocari Sweat 500ml', price: 20000, qty: 14 },
      { productId: 'POS-07', name: 'Phí trọng tài tiêu chuẩn', price: 250000, qty: 1 },
    ],
  },
  {
    id: 'SBL-24114',
    pitchId: 'Sân 09',
    pitchType: '7 người',
    customerName: 'Hà Đức Chinh',
    teamName: 'FC Bình Brothers',
    phone: '0972 440 129',
    date: '2026-10-17',
    startHour: 19.5,
    durationHours: 1.5,
    pitchPrice: 870000,
    depositPaid: 400000,
    status: 'confirmed',
    posItems: [],
  },
  {
    id: 'SBL-24115',
    pitchId: 'Sân 10',
    pitchType: '7 người',
    customerName: 'Quế Ngọc Hải',
    teamName: 'FC Sông Lam Miền Nam',
    phone: '0913 880 712',
    date: '2026-10-17',
    startHour: 18.0,
    durationHours: 2.0,
    pitchPrice: 1160000,
    depositPaid: 600000,
    status: 'checked-in',
    posItems: [{ productId: 'POS-04', name: 'Thùng đá + Trà ca lớn', price: 35000, qty: 3 }],
  },
  {
    id: 'SBL-24116',
    pitchId: 'Sân 11',
    pitchType: '7 người',
    customerName: 'Nguyễn Hoàng Đức',
    teamName: 'FC FPT Software',
    phone: '0988 512 309',
    date: '2026-10-17',
    startHour: 19.0,
    durationHours: 1.5,
    pitchPrice: 870000,
    depositPaid: 0,
    status: 'pending',
    notes: 'Đang chờ đội chuyển cọc',
    posItems: [],
  },
  {
    id: 'SBL-24117',
    pitchId: 'Sân 12',
    pitchType: '7 người',
    customerName: 'Đỗ Hùng Dũng',
    teamName: 'FC Thành Đồng',
    phone: '0906 234 991',
    date: '2026-10-17',
    startHour: 17.0,
    durationHours: 2.0,
    pitchPrice: 1160000,
    depositPaid: 1160000,
    status: 'checked-in',
    posItems: [{ productId: 'POS-01', name: 'Nước suối Aquafina 500ml', price: 10000, qty: 20 }],
  },
  {
    id: 'SBL-24118',
    pitchId: 'Sân 12',
    pitchType: '7 người',
    customerName: 'Nguyễn Tiến Linh',
    teamName: 'FC Becamex Hải Ngoại',
    phone: '0945 771 603',
    date: '2026-10-17',
    startHour: 21.0,
    durationHours: 1.5,
    pitchPrice: 660000,
    depositPaid: 300000,
    status: 'confirmed',
    posItems: [],
  },
];

export interface CustomerRecord {
  id: string;
  name: string;
  teamName: string;
  phone: string;
  tier: 'Khách cố định tháng' | 'Khách VIP' | 'Vãng lai' | 'Cảnh báo Boom';
  preferredPitch: string;
  totalBookings: number;
  boomCount: number;
  totalSpent: number;
  lastVisit: string;
  notes: string;
}

export const INITIAL_CUSTOMERS: CustomerRecord[] = [
  {
    id: 'KH-001',
    name: 'Nguyễn Minh Tuấn',
    teamName: 'FC Bình Thạnh United',
    phone: '0909 412 889',
    tier: 'Khách cố định tháng',
    preferredPitch: 'Sân 01 (5 người)',
    totalBookings: 46,
    boomCount: 0,
    totalSpent: 28450000,
    lastVisit: '17/10/2026',
    notes: 'Hợp đồng cố định thứ 4 & thứ 7 hàng tuần.',
  },
  {
    id: 'KH-002',
    name: 'Nguyễn Công Phượng',
    teamName: 'FC Doanh Nhân Trẻ',
    phone: '0901 999 456',
    tier: 'Khách VIP',
    preferredPitch: 'Sân 09 (7 người)',
    totalBookings: 38,
    boomCount: 0,
    totalSpent: 49200000,
    lastVisit: '17/10/2026',
    notes: 'Thường mượn trọng tài và gọi Pocari cho cả đội.',
  },
  {
    id: 'KH-003',
    name: 'Trần Quốc Đạt',
    teamName: 'FC Techcombank Q1',
    phone: '0938 602 911',
    tier: 'Khách cố định tháng',
    preferredPitch: 'Sân 02 (5 người)',
    totalBookings: 29,
    boomCount: 0,
    totalSpent: 19800000,
    lastVisit: '17/10/2026',
    notes: 'Thanh toán chuyển khoản công ty cuối tháng.',
  },
  {
    id: 'KH-004',
    name: 'Vũ Đình Trọng',
    teamName: 'FC Tự Do Quận 3',
    phone: '0965 901 238',
    tier: 'Cảnh báo Boom',
    preferredPitch: 'Sân 03 (5 người)',
    totalBookings: 6,
    boomCount: 2,
    totalSpent: 1850000,
    lastVisit: '17/10/2026',
    notes: 'Đã báo boom 2 lần khung giờ vàng 17:30. Bắt buộc cọc 100% trước khi giữ sân.',
  },
  {
    id: 'KH-005',
    name: 'Đặng Quốc Việt',
    teamName: 'FC Giản Đơn',
    phone: '0977 339 102',
    tier: 'Vãng lai',
    preferredPitch: 'Sân 02 (5 người)',
    totalBookings: 9,
    boomCount: 1,
    totalSpent: 4620000,
    lastVisit: '12/10/2026',
    notes: 'Có 1 lần huỷ trễ, nhắc chuyển cọc trước 60 phút.',
  },
  {
    id: 'KH-006',
    name: 'Quế Ngọc Hải',
    teamName: 'FC Sông Lam Miền Nam',
    phone: '0913 880 712',
    tier: 'Khách VIP',
    preferredPitch: 'Sân 10 (7 người)',
    totalBookings: 34,
    boomCount: 0,
    totalSpent: 41600000,
    lastVisit: '17/10/2026',
    notes: 'Đội trưởng uy tín, luôn thanh toán cọc giờ vàng lớn.',
  },
  {
    id: 'KH-007',
    name: 'Phạm Gia Huy',
    teamName: 'FC Kiến Trúc Trẻ',
    phone: '0983 115 204',
    tier: 'Khách cố định tháng',
    preferredPitch: 'Sân 01 (5 người)',
    totalBookings: 22,
    boomCount: 0,
    totalSpent: 14100000,
    lastVisit: '17/10/2026',
    notes: 'Hay thuê áo Bib và giày size 41-42.',
  },
];

export interface PosProduct {
  id: string;
  sku: string;
  name: string;
  category: 'Nước giải khát' | 'Thuê & Phụ kiện' | 'Dịch vụ sân' | 'Đồ ăn nhẹ';
  price: number;
  unit: string;
  stock: number;
  minStock: number;
}

export const INITIAL_POS_PRODUCTS: PosProduct[] = [
  { id: 'POS-01', sku: 'DRK-AQUA-500', name: 'Nước suối Aquafina 500ml', category: 'Nước giải khát', price: 10000, unit: 'Chai', stock: 240, minStock: 48 },
  { id: 'POS-02', sku: 'DRK-REV-500', name: 'Revive Chanh Muối 500ml', category: 'Nước giải khát', price: 15000, unit: 'Chai', stock: 164, minStock: 36 },
  { id: 'POS-03', sku: 'DRK-POC-500', name: 'Pocari Sweat Ion 500ml', category: 'Nước giải khát', price: 20000, unit: 'Chai', stock: 92, minStock: 30 },
  { id: 'POS-04', sku: 'DRK-ICE-TEA', name: 'Thùng đá + Trà ca lớn', category: 'Nước giải khát', price: 35000, unit: 'Thùng', stock: 45, minStock: 10 },
  { id: 'POS-08', sku: 'DRK-STING-330', name: 'Nước tăng lực Sting Dâu', category: 'Nước giải khát', price: 15000, unit: 'Chai', stock: 18, minStock: 24 },
  { id: 'POS-05', sku: 'RNT-SHOE-KMT', name: 'Thuê giày Kamito Tuấn Anh', category: 'Thuê & Phụ kiện', price: 35000, unit: 'Đôi/Trận', stock: 28, minStock: 10 },
  { id: 'POS-06', sku: 'RNT-BIB-SET', name: 'Thuê áo Bib (10 áo)', category: 'Thuê & Phụ kiện', price: 40000, unit: 'Bộ/Trận', stock: 16, minStock: 6 },
  { id: 'POS-09', sku: 'RNT-GLOVE-GK', name: 'Thuê găng tay thủ môn Zocker', category: 'Thuê & Phụ kiện', price: 30000, unit: 'Đôi/Trận', stock: 9, minStock: 4 },
  { id: 'POS-10', sku: 'ACC-TAPE-SPT', name: 'Băng keo thể thao quấn cổ chân', category: 'Thuê & Phụ kiện', price: 25000, unit: 'Cuộn', stock: 11, minStock: 15 },
  { id: 'POS-07', sku: 'SRV-REF-STD', name: 'Thuê trọng tài điều khiển trận', category: 'Dịch vụ sân', price: 250000, unit: 'Trận (90p)', stock: 99, minStock: 1 },
  { id: 'POS-11', sku: 'SRV-BALL-PRO', name: 'Thuê bóng Động Lực FIFA Quality', category: 'Dịch vụ sân', price: 30000, unit: 'Quả/Trận', stock: 24, minStock: 8 },
  { id: 'POS-12', sku: 'FD-BANANA-SET', name: 'Chuối bổ sung năng lượng (Nải)', category: 'Đồ ăn nhẹ', price: 35000, unit: 'Phần', stock: 14, minStock: 5 },
];

export interface EquipmentIncident {
  id: string;
  code: string;
  pitchId: string;
  equipmentName: string;
  category: 'Hệ thống chiếu sáng' | 'Mặt sân & Lưới' | 'Bóng & Áo Bib' | 'Hệ thống cấp thoát nước';
  severity: 'Cao' | 'Trung bình' | 'Thấp';
  status: 'Đang xử lý' | 'Chờ linh kiện' | 'Đã khắc phục';
  reportedBy: string;
  reportedAt: string;
  description: string;
  estimatedCost: number;
}

export const INITIAL_EQUIPMENT_INCIDENTS: EquipmentIncident[] = [
  {
    id: 'INC-01',
    code: 'SC-2026-089',
    pitchId: 'Sân 05',
    equipmentName: 'Cột đèn pha LED 400W góc Đông Bắc',
    category: 'Hệ thống chiếu sáng',
    severity: 'Cao',
    status: 'Đang xử lý',
    reportedBy: 'Trương Thịnh Phát',
    reportedAt: '17/10/2026 - 16:40',
    description: 'Chập chờn driver nguồn số 2, giảm khoảng 20% độ sáng góc phạt góc.',
    estimatedCost: 650000,
  },
  {
    id: 'INC-02',
    code: 'SC-2026-088',
    pitchId: 'Sân 11',
    equipmentName: 'Lưới chắn bóng sau cầu môn phía Nam',
    category: 'Mặt sân & Lưới',
    severity: 'Trung bình',
    status: 'Chờ linh kiện',
    reportedBy: 'Trần Văn Hậu',
    reportedAt: '16/10/2026 - 21:15',
    description: 'Đứt cáp neo tầng dưới 1.8m, cần đan gia cố trước giải cuối tuần.',
    estimatedCost: 320000,
  },
  {
    id: 'INC-03',
    code: 'SC-2026-085',
    pitchId: 'Sân 02',
    equipmentName: 'Đường chỉ nối cỏ khu vực 6m',
    category: 'Mặt sân & Lưới',
    severity: 'Thấp',
    status: 'Đã khắc phục',
    reportedBy: 'Nguyễn Anh Khoa',
    reportedAt: '14/10/2026 - 09:30',
    description: 'Bong keo mối nối 60cm, kỹ thuật đã dán keo chuyên dụng 2 thành phần.',
    estimatedCost: 180000,
  },
  {
    id: 'INC-04',
    code: 'SC-2026-082',
    pitchId: 'Sân 09',
    equipmentName: 'Lô bóng thi đấu Động Lực UHV 2.07 (4 quả)',
    category: 'Bóng & Áo Bib',
    severity: 'Thấp',
    status: 'Đã khắc phục',
    reportedBy: 'Trương Thịnh Phát',
    reportedAt: '12/10/2026 - 18:00',
    description: 'Mòn van hơi 4 quả, trọng tài đã thay mới từ kho dự phòng.',
    estimatedCost: 480000,
  },
];

export interface StockMovementRecord {
  id: string;
  timestamp: string;
  type: 'Nhập kho' | 'Xuất bán POS' | 'Kiểm kê ca';
  productName: string;
  quantityChange: number;
  staffName: string;
  note: string;
}

export const INITIAL_STOCK_MOVEMENTS: StockMovementRecord[] = [
  { id: 'MOV-901', timestamp: '17/10/2026 - 14:15', type: 'Nhập kho', productName: 'Nước suối Aquafina 500ml', quantityChange: +120, staffName: 'Trương Thịnh Phát', note: 'Nhập 5 thùng từ NPP Tân Hiệp Phát' },
  { id: 'MOV-902', timestamp: '17/10/2026 - 16:05', type: 'Xuất bán POS', productName: 'Thùng đá + Trà ca lớn', quantityChange: -2, staffName: 'Trương Thịnh Phát', note: 'Gắn đơn SBL-24104 (Sân 02)' },
  { id: 'MOV-903', timestamp: '17/10/2026 - 17:35', type: 'Xuất bán POS', productName: 'Revive Chanh Muối 500ml', quantityChange: -8, staffName: 'Trương Thịnh Phát', note: 'Gắn đơn SBL-24102 (Sân 01)' },
  { id: 'MOV-904', timestamp: '16/10/2026 - 22:30', type: 'Kiểm kê ca', productName: 'Băng keo thể thao quấn cổ chân', quantityChange: -3, staffName: 'Phạm Thị Mai', note: 'Xuất dùng sơ cứu tại quầy' },
];

export interface StaffMember {
  id: string;
  code: string;
  name: string;
  role: 'Điều phối viên trưởng' | 'Thu ngân & POS' | 'Kỹ thuật & Kho' | 'Bảo vệ & Trông xe';
  shift: 'Ca Sáng (06:30 - 14:30)' | 'Ca Chiều (14:00 - 22:00)' | 'Ca Đêm (18:00 - 24:30)';
  phone: string;
  status: 'Đang trực' | 'Nghỉ ca' | 'Tăng ca';
  completedOrders: number;
  punctualityRate: string;
}

export const INITIAL_STAFF: StaffMember[] = [
  { id: 'NV-01', code: 'SBL-NV01', name: 'Trương Thịnh Phát', role: 'Điều phối viên trưởng', shift: 'Ca Chiều (14:00 - 22:00)', phone: '0904 112 389', status: 'Đang trực', completedOrders: 142, punctualityRate: '99.2%' },
  { id: 'NV-02', code: 'SBL-NV02', name: 'Phạm Thị Mai', role: 'Thu ngân & POS', shift: 'Ca Chiều (14:00 - 22:00)', phone: '0938 441 920', status: 'Đang trực', completedOrders: 198, punctualityRate: '100%' },
  { id: 'NV-03', code: 'SBL-NV03', name: 'Trần Văn Hậu', role: 'Kỹ thuật & Kho', shift: 'Ca Đêm (18:00 - 24:30)', phone: '0971 228 615', status: 'Đang trực', completedOrders: 64, punctualityRate: '97.8%' },
  { id: 'NV-04', code: 'SBL-NV04', name: 'Nguyễn Anh Khoa', role: 'Điều phối viên trưởng', shift: 'Ca Sáng (06:30 - 14:30)', phone: '0915 802 114', status: 'Nghỉ ca', completedOrders: 118, punctualityRate: '98.5%' },
  { id: 'NV-05', code: 'SBL-NV05', name: 'Đặng Minh Đức', role: 'Bảo vệ & Trông xe', shift: 'Ca Chiều (14:00 - 22:00)', phone: '0982 319 407', status: 'Tăng ca', completedOrders: 85, punctualityRate: '99.0%' },
];

export interface RevenueTransaction {
  id: string;
  code: string;
  timestamp: string;
  pitchOrCounter: string;
  customerOrTeam: string;
  category: 'Tiền thuê sân' | 'Bán hàng POS' | 'Tiền cọc giữ sân' | 'Chi phí bảo trì';
  paymentMethod: 'Chuyển khoản QR' | 'Tiền mặt' | 'Công nợ tháng';
  amount: number;
  cashier: string;
  status: 'Đã quyết toán' | 'Chờ đối soát';
}

export const INITIAL_REVENUE_TRANSACTIONS: RevenueTransaction[] = [
  { id: 'FIN-101', code: 'PT-261017-01', timestamp: '17/10/2026 - 18:10', pitchOrCounter: 'Sân 12 (7 người)', customerOrTeam: 'FC Thành Đồng', category: 'Tiền thuê sân', paymentMethod: 'Chuyển khoản QR', amount: 1360000, cashier: 'Trương Thịnh Phát', status: 'Đã quyết toán' },
  { id: 'FIN-102', code: 'PT-261017-02', timestamp: '17/10/2026 - 17:45', pitchOrCounter: 'Sân 09 (7 người)', customerOrTeam: 'FC Doanh Nhân Trẻ', category: 'Tiền cọc giữ sân', paymentMethod: 'Chuyển khoản QR', amount: 500000, cashier: 'Phạm Thị Mai', status: 'Đã quyết toán' },
  { id: 'FIN-103', code: 'PT-261017-03', timestamp: '17/10/2026 - 17:20', pitchOrCounter: 'Quầy POS Trung tâm', customerOrTeam: 'FC Kiến Trúc Trẻ (Sân 01)', category: 'Bán hàng POS', paymentMethod: 'Tiền mặt', amount: 160000, cashier: 'Phạm Thị Mai', status: 'Đã quyết toán' },
  { id: 'FIN-104', code: 'PT-261017-04', timestamp: '17/10/2026 - 16:30', pitchOrCounter: 'Sân 02 (5 người)', customerOrTeam: 'FC Techcombank Q1', category: 'Tiền thuê sân', paymentMethod: 'Công nợ tháng', amount: 610000, cashier: 'Trương Thịnh Phát', status: 'Chờ đối soát' },
  { id: 'FIN-105', code: 'PT-261017-05', timestamp: '17/10/2026 - 10:35', pitchOrCounter: 'Sân 03 (5 người)', customerOrTeam: 'FC Bách Khoa K18', category: 'Tiền thuê sân', paymentMethod: 'Chuyển khoản QR', amount: 560000, cashier: 'Nguyễn Anh Khoa', status: 'Đã quyết toán' },
  { id: 'FIN-106', code: 'PC-261017-01', timestamp: '17/10/2026 - 09:45', pitchOrCounter: 'Sân 05 (5 người)', customerOrTeam: 'Vật tư chiếu sáng', category: 'Chi phí bảo trì', paymentMethod: 'Tiền mặt', amount: -650000, cashier: 'Nguyễn Anh Khoa', status: 'Đã quyết toán' },
];

export interface AuditLogEntry {
  id: string;
  traceId: string;
  timestamp: string;
  actor: string;
  role: string;
  category: 'Điều phối sân' | 'Thanh toán & POS' | 'Cảnh báo Boom' | 'Kho & Thiết bị' | 'Bật ca trực';
  actionSummary: string;
  targetRef: string;
  ipAddress: string;
}

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  { id: 'AUD-01', traceId: 'TRC-9942A', timestamp: '17/10/2026 - 17:58:12', actor: 'Trương Thịnh Phát', role: 'Điều phối viên', category: 'Cảnh báo Boom', actionSummary: 'Đánh dấu báo Boom đơn SBL-24107 do quá 25 phút không nhận sân', targetRef: 'Sân 03 - FC Tự Do Quận 3', ipAddress: '192.168.1.14' },
  { id: 'AUD-02', traceId: 'TRC-9941F', timestamp: '17/10/2026 - 17:34:05', actor: 'Phạm Thị Mai', role: 'Thu ngân & POS', category: 'Thanh toán & POS', actionSummary: 'Thêm 8 chai Revive Chanh Muối + 1 bộ Bib vào phiên SBL-24102', targetRef: 'Sân 01 - 160.000 đ', ipAddress: '192.168.1.18' },
  { id: 'AUD-03', traceId: 'TRC-9939C', timestamp: '17/10/2026 - 16:42:30', actor: 'Trương Thịnh Phát', role: 'Điều phối viên', category: 'Kho & Thiết bị', actionSummary: 'Tạo phiếu SC-2026-089 (Đèn pha LED 400W góc Đông Bắc)', targetRef: 'Sân 05', ipAddress: '192.168.1.14' },
  { id: 'AUD-04', traceId: 'TRC-9935B', timestamp: '17/10/2026 - 16:02:19', actor: 'Trương Thịnh Phát', role: 'Điều phối viên', category: 'Điều phối sân', actionSummary: 'Xác nhận Nhận sân (Check-in) cho đội FC Techcombank Q1', targetRef: 'Sân 02 - SBL-24104', ipAddress: '192.168.1.14' },
  { id: 'AUD-05', traceId: 'TRC-9930E', timestamp: '17/10/2026 - 14:15:44', actor: 'Trương Thịnh Phát', role: 'Điều phối viên', category: 'Kho & Thiết bị', actionSummary: 'Nhập kho 120 chai Nước suối Aquafina 500ml từ NPP Tân Hiệp Phát', targetRef: 'MOV-901', ipAddress: '192.168.1.14' },
  { id: 'AUD-06', traceId: 'TRC-9928D', timestamp: '17/10/2026 - 14:00:08', actor: 'Trương Thịnh Phát', role: 'Điều phối viên', category: 'Bật ca trực', actionSummary: 'Nhận giao ca trực CA-02 từ Nguyễn Anh Khoa (Tồn quỹ đầu ca: 4.500.000 đ)', targetRef: 'CA-02', ipAddress: '192.168.1.14' },
];
