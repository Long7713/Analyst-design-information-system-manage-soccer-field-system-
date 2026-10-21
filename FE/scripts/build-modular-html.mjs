import fs from 'node:fs';
import path from 'node:path';

const PAGES = [
  {
    file: 'dashboard.html',
    navId: 'tong-quan',
    group: 'ĐIỀU PHỐI & LỊCH SÂN',
    title: 'Tổng Quan Vận Hành Cụm 12 Sân',
    subtitle: 'Báo cáo trực tiếp ca chiều ngày 17/10/2026 – Khung giờ hoạt động 07:00 – 24:00',
    kpis: [
      ['Doanh thu dự kiến hôm nay', '11.840.000 đ', '18 ca • +14.2%'],
      ['Công suất khung giờ vàng', '91.6%', '11 / 12 sân kín lịch'],
      ['Cảnh báo Boom & Chờ cọc', '3 ca', '1 đơn Boom (Sân 03) • 2 chờ cọc'],
      ['Sự cố thiết bị & Tồn kho', '4 mục', '2 sự cố • 2 mặt hàng hết'],
    ],
    tableTitle: 'Trạng Thái Trực Tiếp 12 Sân Bóng (Sân 01 đến 12)',
    headers: ['Sân Bóng', 'Loại Sân', 'Đang Đá / Khung Giờ', 'Giá Giờ Vàng', 'Trạng Thái', 'Thao Tác'],
    rows: [
      ['Sân 01', '5 người', 'FC Kiến Trúc Trẻ (17:30–19:00)', '360.000 đ', 'Đang đá', 'Điều phối'],
      ['Sân 02', '5 người', 'FC Giản Đơn (18:00–19:30)', '360.000 đ', 'Chờ chuyển cọc', 'Nhận sân'],
      ['Sân 03', '5 người', 'FC Tự Do Quận 3 (17:30–19:00)', '360.000 đ', 'Báo Boom', 'Mở lại'],
      ['Sân 04', '5 người', 'FC Vạn Phúc (18:30–20:00)', '360.000 đ', 'Đã cọc giữ sân', 'Nhận sân'],
      ['Sân 09', '7 người', 'FC Doanh Nhân Trẻ (17:30–19:00)', '580.000 đ', 'Đang đá', 'Thêm món POS'],
      ['Sân 10', '7 người', 'FC Sông Lam Miền Nam (18:00–20:00)', '580.000 đ', 'Đang đá', 'Điều phối'],
      ['Sân 11', '7 người', 'FC FPT Software (19:00–20:30)', '580.000 đ', 'Chờ chuyển cọc', 'Nhắc cọc'],
      ['Sân 12', '7 người', 'FC Thành Đồng (17:00–19:00)', '580.000 đ', 'Đang đá', 'Điều phối'],
    ],
  },
  {
    file: 'schedule.html',
    navId: 'lich-san',
    group: 'ĐIỀU PHỐI & LỊCH SÂN',
    title: 'Trung Tâm Điều Phối, Lịch Sân & Đặt Chỗ (07:00 – 24:00)',
    subtitle: 'Cụm 12 sân tiêu chuẩn (Sân 01 đến 12) – Đổi giờ, Thêm giờ, Báo boom, Hủy, Nhận sân, Thêm món',
    kpis: [
      ['Đang đá trên sân', '9 ca', 'Sân 01, 02, 03, 05, 08, 09, 10, 12'],
      ['Đã cọc giữ sân', '6 ca', 'Đã đối soát cọc QR'],
      ['Chờ chuyển khoản cọc', '2 ca', 'Cần xác nhận trước 60p'],
      ['Báo Boom / Quá giờ', '1 ca', 'Sân 03 (17:30–19:00)'],
    ],
    tableTitle: 'Bảng Điều Phối Lịch Sân & Đặt Chỗ 07:00 – 24:00 (Sân 01 đến 12)',
    headers: ['Mã Phiếu', 'Sân', 'Khung Giờ', 'Đội Bóng / Khách Đặt', 'Trạng Thái', 'Nghiệp Vụ Nhanh'],
    rows: [
      ['SBL-24102', 'Sân 01 (5 người)', '17:30 – 19:00', 'FC Kiến Trúc Trẻ • Phạm Gia Huy', 'Đang đá', 'Thêm giờ / Thêm món'],
      ['SBL-24105', 'Sân 02 (5 người)', '18:00 – 19:30', 'FC Giản Đơn • Đặng Quốc Việt', 'Chờ chuyển cọc', 'Nhận sân / Báo boom'],
      ['SBL-24107', 'Sân 03 (5 người)', '17:30 – 19:00', 'FC Tự Do Quận 3 • Vũ Đình Trọng', 'Báo Boom', 'Đổi giờ / Hủy sân'],
      ['SBL-24113', 'Sân 09 (7 người)', '17:30 – 19:00', 'FC Doanh Nhân Trẻ • Nguyễn Hồng Phong', 'Đang đá', 'Thêm giờ / Thêm món'],
      ['SBL-24115', 'Sân 10 (7 người)', '18:00 – 20:00', 'FC Sông Lam Miền Nam • Hải', 'Đang đá', 'Thêm giờ / Thêm món'],
    ],
  },
  {
    file: 'customers.html',
    navId: 'khach-hang',
    group: 'ĐIỀU PHỐI & LỊCH SÂN',
    title: 'Quản Lý Khách Hàng & Đội Bóng',
    subtitle: 'Hồ sơ đội trưởng, hợp đồng cố định thường và rủi ro Boom sân',
    kpis: [
      ['Tổng đội bóng đăng ký', '128 đội', '42 hợp đồng cố định thường'],
      ['Khách VIP & Doanh nghiệp', '24 đội', 'Chi tiêu > 25 triệu/tháng'],
      ['Đội cảnh báo Boom', '3 đội', 'Bắt buộc cọc 100% trước giờ'],
      ['Tín nhiệm khách quen', '94.8%', 'Tăng trong quý IV'],
    ],
    tableTitle: 'Hồ Sơ Đội Bóng & Chỉ Số Tín Nhiệm',
    headers: ['Mã KH', 'Đội Bóng', 'Đội Trưởng & SĐT', 'Phân Hạng', 'Số Trận', 'Lịch Sử Boom', 'Tổng Chi Tiêu'],
    rows: [
      ['KH-001', 'FC Bình Thạnh United', 'Nguyễn Minh Tuấn • 0909 412 889', 'Khách cố định', '46', 'Uy tín tốt (0 boom)', '28.450.000 đ'],
      ['KH-002', 'FC Doanh Nhân Trẻ', 'Nguyễn Hồng Phong • 0901 999 456', 'Khách VIP', '38', 'Uy tín tốt (0 boom)', '49.200.000 đ'],
      ['KH-004', 'FC Tự Do Quận 3', 'Vũ Đình Trọng • 0965 901 238', 'Cảnh báo Boom', '6', 'Cảnh báo (2 boom)', '1.850.000 đ'],
      ['KH-006', 'FC Sông Lam Miền Nam', 'Quế Ngọc Hải • 0913 880 712', 'Khách VIP', '34', 'Uy tín tốt (0 boom)', '41.600.000 đ'],
    ],
  },
  {
    file: 'pos.html',
    navId: 'dich-vu',
    group: 'DỊCH VỤ & CẬT CHẤT',
    title: 'Dịch Vụ & POS Bán Hàng Tại Quầy',
    subtitle: 'Danh mục giải khát ướp lạnh, thuê giày Kamito, áo Bib và dịch vụ trọng tài',
    kpis: [
      ['Doanh số POS trong ca', '1.465.000 đ', '32 lượt xuất hàng'],
      ['Nước giải khát bán', '84 chai', 'Aquafina, Revive, Pocari'],
      ['Lượt thuê giày & Áo Bib', '14 bộ', 'Đã thu hồi 9 bộ sau trận'],
      ['Gán đơn vào ca sân', '88%', 'Thanh toán gộp cuối trận'],
    ],
    tableTitle: 'Danh Mục Sản Phẩm & Dịch Vụ POS Tại Quầy',
    headers: ['Mã SKU', 'Tên Sản Phẩm / Dịch Vụ', 'Danh Mục', 'Đơn Giá', 'Tồn Quầy', 'Thao Tác'],
    rows: [
      ['DRK-AQUA-500', 'Nước suối Aquafina 500ml', 'Nước giải khát', '10.000 đ', '240 Chai', 'Thêm vào giỏ'],
      ['DRK-REV-500', 'Revive Chanh Muối 500ml', 'Nước giải khát', '15.000 đ', '164 Chai', 'Thêm vào giỏ'],
      ['DRK-POC-500', 'Pocari Sweat Ion 500ml', 'Nước giải khát', '20.000 đ', '92 Chai', 'Thêm vào giỏ'],
      ['RNT-SHOE-KMT', 'Thuê giày Kamito Tuấn Anh', 'Thuê & Phụ kiện', '35.000 đ', '28 Đôi', 'Thêm vào giỏ'],
      ['RNT-BIB-SET', 'Thuê áo Bib (10 áo)', 'Thuê & Phụ kiện', '40.000 đ', '16 Bộ', 'Thêm vào giỏ'],
      ['SRV-REF-STD', 'Thuê trọng tài điều khiển trận', 'Dịch vụ thi đấu', '250.000 đ', 'Sẵn sàng', 'Thêm vào giỏ'],
    ],
  },
  {
    file: 'equipment.html',
    navId: 'thiet-bi',
    group: 'DỊCH VỤ & CẬT CHẤT',
    title: 'Quản Lý Thiết Bị & Bảo Trì Sân',
    subtitle: 'Theo dõi đèn pha LED 400W, mặt cỏ, lưới chắn bóng và lịch sử bảo trì kỹ thuật',
    kpis: [
      ['Đèn pha LED 400W hoạt động', '94 / 96 cụm', '97.9% công suất chiếu sáng'],
      ['Sự cố đang xử lý', '2 phiếu', 'Sân 05 & Sân 11'],
      ['Sự cố khắc phục tháng này', '14 phiếu', 'Thời gian xử lý TB: 3.2 giờ'],
      ['Chi phí bảo trì', '1.630.000 đ', 'Trong định mức ngân sách'],
    ],
    tableTitle: 'Danh Sách Phiếu Sự Cố Thiết Bị',
    headers: ['Mã Sự Cố', 'Sân', 'Hạng Mục Thiết Bị', 'Mức Độ', 'Trạng Thái', 'Chi Phí Dự Toán'],
    rows: [
      ['SC-2026-089', 'Sân 05', 'Cụm đèn pha LED 400W góc khán đài B', 'Cao', 'Đang xử lý', '650.000 đ'],
      ['SC-2026-088', 'Sân 11', 'Lưới chắn sau cầu môn phía Nam', 'Trung bình', 'Chờ linh kiện', '320.000 đ'],
      ['SC-2026-085', 'Sân 02', 'Đường chỉ trắng khu vực 6m', 'Thấp', 'Đã khắc phục', '180.000 đ'],
      ['SC-2026-082', 'Sân 09', 'Lô bóng thi đấu Động Lực UHV 2.07', 'Thấp', 'Đã khắc phục', '480.000 đ'],
    ],
  },
  {
    file: 'inventory.html',
    navId: 'kho-hang',
    group: 'DỊCH VỤ & CẬT CHẤT',
    title: 'Quản Lý Kho Hàng & Tồn Kho Dịch Vụ',
    subtitle: 'Kiểm soát tồn kho nước giải khát, phụ kiện thể thao và quy trình phiếu nhập kho',
    kpis: [
      ['Tổng mặt hàng quản lý', '12 SKU', 'Nước uống & Phụ kiện'],
      ['Giá trị tồn kho hiện tại', '18.450.000 đ', 'Đầu ca trực'],
      ['Mặt hàng chạm ngưỡng tối thiểu', '2 SKU', 'Sting Dâu & Băng keo chân'],
      ['Phiếu nhập kho trong tuần', '5 phiếu', '100% khớp chứng từ NPP'],
    ],
    tableTitle: 'Bảng Tồn Kho & Định Mức Tối Thiểu',
    headers: ['Mã SKU', 'Tên Mặt Hàng', 'Nhóm Hàng', 'Tồn Hiện Tại', 'Định Mức Tối Thiểu', 'Trạng Thái Kho'],
    rows: [
      ['DRK-AQUA-500', 'Nước suối Aquafina 500ml', 'Nước giải khát', '240 Chai', '48 Chai', 'Đủ định mức'],
      ['DRK-REV-500', 'Revive Chanh Muối 500ml', 'Nước giải khát', '164 Chai', '36 Chai', 'Đủ định mức'],
      ['DRK-STING-330', 'Nước tăng lực Sting Dâu', 'Nước giải khát', '18 Chai', '24 Chai', 'Sắp hết'],
      ['ACC-TAPE-SPT', 'Băng keo thể thao quấn cổ chân', 'Thuê & Phụ kiện', '11 Cuộn', '15 Cuộn', 'Sắp hết'],
    ],
  },
  {
    file: 'staff.html',
    navId: 'nhan-vien',
    group: 'DỊCH VỤ & CẬT CHẤT',
    title: 'Nhân Sự & Phân Ca Trực Vận Hành',
    subtitle: 'Danh sách điều phối viên, thu ngân POS, kỹ thuật và phân ca trực',
    kpis: [
      ['Nhân sự đang trong ca', '4 nhân sự', 'Ca Chiều (14:00 - 22:00)'],
      ['Tỷ lệ đúng giờ tháng', '98.9%', 'Tháng 10/2026'],
      ['Tổ trọng tài cộng tác', '8 trọng tài', 'Sẵn sàng khung 17:30–22:00'],
      ['Quỹ lương & Phụ cấp ca', 'Đúng tiến độ', 'Tất toán ngày 05 hàng tháng'],
    ],
    tableTitle: 'Danh Sách Nhân Sự Vận Hành SANBONGLON',
    headers: ['Mã NV', 'Họ Tên', 'Vị Trí', 'Ca Trực', 'Số Điện Thoại', 'Trạng Thái'],
    rows: [
      ['SBL-NV01', 'Trương Thịnh Phát', 'Điều phối viên trưởng', 'Ca Chiều (14:00 - 22:00)', '0904 112 389', 'Đang trực'],
      ['SBL-NV02', 'Phạm Thị Mai', 'Thu ngân & POS', 'Ca Chiều (14:00 - 22:00)', '0938 441 920', 'Đang trực'],
      ['SBL-NV03', 'Trần Hữu Hậu', 'Kỹ thuật & Kho', 'Ca Đêm (18:00 - 24:30)', '0971 228 615', 'Đang trực'],
      ['SBL-NV04', 'Nguyễn Khoa', 'Điều phối viên trưởng', 'Ca Sáng (06:30 - 14:30)', '0915 802 114', 'Nghỉ ca'],
    ],
  },
  {
    file: 'revenue.html',
    navId: 'doanh-thu',
    group: 'TÀI CHÍNH & QUẢN TRỊ',
    title: 'Báo Cáo Doanh Thu & Tài Chính',
    subtitle: 'Sổ thu chi, đối soát chuyển khoản VietQR, doanh thu thu ngân POS',
    kpis: [
      ['Doanh thu thuê sân & Cọc', '3.030.000 đ', 'Đã quyết toán trong ca'],
      ['Doanh thu bán hàng POS', '160.000 đ', 'Quầy trung tâm'],
      ['Chi phí bảo trì phát sinh', '- 650.000 đ', 'Vật tư đèn pha Sân 05'],
      ['Thực thu ròng (Net Cashflow)', '2.540.000 đ', 'Khớp tồn quỹ'],
    ],
    tableTitle: 'Sổ Giao Dịch Tài Chính Chi Tiết',
    headers: ['Mã Chứng Từ', 'Thời Gian', 'Điểm Thu', 'Khách Hàng / Nội Dung', 'Phương Thức', 'Số Tiền'],
    rows: [
      ['PT-261017-01', '17/10/2026 – 18:10', 'Sân 12 (7 người)', 'FC Thành Đồng', 'Chuyển khoản QR', '+1.360.000 đ'],
      ['PT-261017-02', '17/10/2026 – 17:45', 'Sân 09 (7 người)', 'FC Doanh Nhân Trẻ', 'Chuyển khoản QR', '+500.000 đ'],
      ['PT-261017-03', '17/10/2026 – 17:20', 'Quầy POS Trung tâm', 'FC Kiến Trúc Trẻ (Sân 01)', 'Tiền mặt', '+160.000 đ'],
      ['PC-261017-01', '17/10/2026 – 09:45', 'Sân 05 (5 người)', 'Vật tư chiếu sáng', 'Tiền mặt', '-650.000 đ'],
    ],
  },
  {
    file: 'analytics.html',
    navId: 'thong-ke',
    group: 'TÀI CHÍNH & QUẢN TRỊ',
    title: 'Thống Kê Vận Hành & Phân Tích Chuyên Sâu',
    subtitle: '5 phân khu phân tích: 1. Thống kê sân – 2. Khách hàng & rủi ro – 3. Hiệu suất nhân sự – 4. Doanh thu dòng tiền – 5. Dịch vụ & tồn kho thiết bị',
    kpis: [
      ['1. Thống kê sân (Công suất TB)', '86.4%', '12 sân hoạt động 07:00–24:00'],
      ['2. Khách hàng & Rủi ro Boom', '1.8%', 'Tín nhiệm 94.8%'],
      ['3. Hiệu suất nhân sự (Check-in)', '42 giây', '100% ca trực khớp quỹ'],
      ['4. Doanh thu & 5. Dịch vụ POS', '78.4% QR', 'Biên lợi nhuận gộp 68.5%'],
    ],
    tableTitle: 'Tổng Hợp Chỉ Số 5 Phân Khu Phân Tích Chuyên Sâu',
    headers: ['Phân Khu Phân Tích', 'Chỉ Số Trọng Tâm', 'Kết Quả Hiện Tại', 'So Với Chu Kỳ Trước', 'Đánh Giá'],
    rows: [
      ['1. Thống kê sân', 'Tỷ lệ lấp đầy giờ vàng (17:00–21:00)', '91.6%', '+4.2%', 'Vượt mục tiêu'],
      ['2. Khách hàng và rủi ro', 'Tỷ lệ Boom sân không báo trước', '1.8%', '-2.4%', 'Kiểm soát rất tốt'],
      ['3. Hiệu suất nhân sự', 'Thời gian trung bình làm thủ tục nhận sân', '42 giây', '-11 giây', 'Rất nhanh'],
      ['4. Doanh thu dòng tiền', 'Tỷ trọng thanh toán không tiền mặt (VietQR)', '78.4%', '+9.1%', 'Tối ưu đối soát'],
      ['5. Dịch vụ và tồn kho thiết bị', 'Tỷ lệ khách mua kèm nước/Bib', '64.2%', '+6.5%', 'Tăng trưởng tốt'],
    ],
  },
  {
    file: 'audit-log.html',
    navId: 'nhat-ky-hoat-dong',
    group: 'TÀI CHÍNH & QUẢN TRỊ',
    title: 'Nhật Ký Hoạt Động & Vết Kiểm Toán',
    subtitle: 'Lưu vết toàn bộ điều phối lịch sân, giao dịch POS, cảnh báo Boom và ca trực',
    kpis: [
      ['Số bản ghi nhận hôm nay', '146 bản ghi', 'Lưu trữ bất biến'],
      ['Thao tác điều phối & Nhận sân', '82 sự kiện', 'Đổi giờ, Thêm giờ, Nhận sân'],
      ['Sự kiện cảnh báo Boom', '1 sự kiện', 'TRC-9942A (Sân 03)'],
      ['Kiểm toán giao quỹ giữa ca', 'Khớp 100%', 'Ca Sáng -> Ca Chiều'],
    ],
    tableTitle: 'Danh Sách Vết Kiểm Toán Thời Gian Thực (Audit Trail)',
    headers: ['Mã Trace', 'Thời Gian', 'Nhân Sự', 'Phân Nhóm', 'Nội Dung Thao Tác', 'Đối Tượng'],
    rows: [
      ['TRC-9942A', '17/10/2026 – 17:58:12', 'Trương Thịnh Phát', 'Cảnh báo Boom', 'Đánh dấu báo Boom đơn SBL-24107 do quá 25 phút', 'Sân 03'],
      ['TRC-9941F', '17/10/2026 – 17:34:05', 'Phạm Thị Mai', 'Thanh toán & POS', 'Thêm 8 chai Revive + 1 bộ Bib vào phiếu SBL-24102', 'Sân 01 – 160.000 đ'],
      ['TRC-9939C', '17/10/2026 – 16:42:30', 'Trương Thịnh Phát', 'Kho & Thiết bị', 'Tạo phiếu SC-2026-089 (Đèn pha LED 400W)', 'Sân 05'],
      ['TRC-9935B', '17/10/2026 – 16:02:19', 'Trương Thịnh Phát', 'Điều phối sân', 'Xác nhận Nhận sân (Check-in) cho đội FC Techcombank Q1', 'Sân 02'],
    ],
  },
  {
    file: 'account-settings.html',
    navId: 'cai-dat-he-thong',
    group: 'TÀI CHÍNH & QUẢN TRỊ',
    title: 'Tài Khoản, Bảo Mật & Cài Đặt Hệ Thống',
    subtitle: 'Quản lý thông tin ca trực, mật khẩu an toàn và kiểm soát bảo mật',
    kpis: [
      ['Tài khoản đang trực', 'Trương Thịnh Phát', 'Mã NV: SBL-NV01'],
      ['Vai trò', 'Điều phối viên trưởng', 'Cụm 12 sân'],
      ['Xác thực 2 lớp (2FA)', 'Đang bật', 'Bảo vệ thao tác hủy phiếu'],
      ['Trạng thái hệ thống', 'Hoạt động bình thường', 'Cụm 12 sân'],
    ],
    tableTitle: 'Phiên Đăng Nhập Thiết Bị Trong Ca Trực',
    headers: ['Thiết Bị / Trình Duyệt', 'Vị Trí Đặt', 'Địa Chỉ IP', 'Thời Điểm Đăng Nhập', 'Trạng Thái'],
    rows: [
      ['MacBook Pro – Chrome 130', 'Quầy Điều Phối Trung Tâm', '192.168.1.14', '17/10/2026 – 14:00', 'Phiên hiện tại'],
      ['iPad Air POS – Safari', 'Quầy Nước & Phụ Kiện', '192.168.1.18', '17/10/2026 – 14:02', 'Đang hoạt động'],
    ],
  },
];

function buildInternalPageHtml(page) {
  const kpiHtml = page.kpis
    .map(
      ([label, val, meta]) => `
        <div class="sbl-kpi-card">
          <div class="sbl-kpi-label"><span>${label}</span></div>
          <div class="sbl-kpi-value">${val}</div>
          <div class="sbl-kpi-meta"><span>${meta}</span></div>
        </div>
      `
    )
    .join('');

  const thHtml = page.headers.map((h) => `<th>${h}</th>`).join('');
  const trHtml = page.rows
    .map(
      (r) => `
        <tr>
          ${r
            .map((cell, idx) =>
              idx === 0
                ? `<td class="font-mono-tech text-xs font-bold">${cell}</td>`
                : `<td>${cell}</td>`
            )
            .join('')}
        </tr>
      `
    )
    .join('');

  return `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${page.title} – SANBONGLON</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/css/variables.css" />
    <link rel="stylesheet" href="/css/global.css" />
    <link rel="stylesheet" href="/css/layout.css" />
    <link rel="stylesheet" href="/css/sidebar.css" />
    <link rel="stylesheet" href="/css/components.css" />
    <link rel="stylesheet" href="/css/animations.css" />
    <link rel="stylesheet" href="/css/responsive.css" />
    <link rel="stylesheet" href="/css/pages.css" />
  </head>
  <body data-page="${page.navId}">
    <div class="sbl-app-shell">
      <!-- Reusable Sidebar Mount Point -->
      <div id="sblSidebarMount"></div>
      <div class="sbl-main-wrapper">
        <header class="sbl-top-header">
          <div class="sbl-header-left">
            <button type="button" class="btn btn-secondary btn-icon btn-sm" data-action="open-mobile-sidebar" aria-label="Mở menu">
              ☰
            </button>
            <div class="sbl-breadcrumb">
              <span class="font-mono-tech">SANBONGLON</span>
              <span>/</span>
              <span>${page.group}</span>
              <span>/</span>
              <span class="sbl-breadcrumb-current">${page.title}</span>
            </div>
          </div>
          <!-- Live Top Bar Clock (Thứ Giờ:phút:giây) -->
          <div style="display:flex;align-items:center;gap:12px;">
            <div id="sblTopClock" class="font-mono-tech" style="background:var(--bg-sand);padding:4px 12px;border-radius:var(--radius-xs);font-size:12px;font-weight:700;border:1px solid var(--border-color);">
              Đang tải giờ...
            </div>
            <a href="/" class="btn btn-secondary btn-sm">Mở giao diện đầy đủ (SPA)</a>
            <button type="button" class="btn btn-lime btn-sm" data-toast="Mở tạo phiếu mới.">
              + Đặt sân mới
            </button>
          </div>
        </header>
        <main class="sbl-main-content">
          <div class="sbl-page-header">
            <div>
              <h1 class="sbl-page-title">${page.title}</h1>
              <p class="sbl-page-subtitle">${page.subtitle}</p>
            </div>
            <div class="sbl-page-actions">
              <input type="search" class="form-input" style="width:240px;" placeholder="Tìm kiếm nhanh trong bảng..." data-table-search="#mainDataTable" />
            </div>
          </div>

          <div class="sbl-kpi-strip">
            ${kpiHtml}
          </div>

          <div class="sbl-panel">
            <div class="sbl-panel-header">
              <h2 class="sbl-panel-title">${page.tableTitle}</h2>
            </div>
            <div class="sbl-table-scroll">
              <table class="sbl-table" id="mainDataTable">
                <thead>
                  <tr>${thHtml}</tr>
                </thead>
                <tbody>
                  ${trHtml}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>

    <script src="/js/sidebar-config.js"></script>
    <script src="/js/sidebar.js"></script>
    <script src="/js/navigation.js"></script>
    <script src="/js/toast.js"></script>
    <script src="/js/modal.js"></script>
    <script src="/js/demo-data.js"></script>
    <script src="/js/app.js"></script>
  </body>
</html>`;
}

const loginHtml = `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Đăng Nhập Ca Trực & Quản Trị – SANBONGLON</title>
    <link rel="stylesheet" href="/css/variables.css" />
    <link rel="stylesheet" href="/css/global.css" />
    <link rel="stylesheet" href="/css/layout.css" />
    <link rel="stylesheet" href="/css/components.css" />
    <link rel="stylesheet" href="/css/animations.css" />
  </head>
  <body data-standalone="true">
    <div style="min-height:100vh;display:flex;flex-direction:column;justify-content:space-between;padding:24px;background:var(--bg-cream);">
      <header style="max-width:960px;width:100%;margin:0 auto;display:flex;justify-content:space-between;align-items:center;">
        <div style="font-family:var(--font-display);font-weight:700;font-size:20px;">SANBONGLON CENTRAL</div>
        <a href="/public/index.html" class="btn btn-secondary btn-sm">Xem lịch sân công khai</a>
      </header>
      <main style="max-width:440px;width:100%;margin:auto;">
        <div class="sbl-panel">
          <div class="sbl-panel-header">
            <h1 class="sbl-panel-title">Đăng Nhập Ca Trực & Quản Trị</h1>
          </div>
          <form class="sbl-panel-body" action="/pages/dashboard.html" style="display:flex;flex-direction:column;gap:16px;">
            <div class="form-group">
              <label class="form-label">Mã nhân viên / Tài khoản:</label>
              <input type="text" class="form-input font-mono-tech" value="SBL-NV01" required />
            </div>
            <div class="form-group">
              <label class="form-label">Mật khẩu ca trực:</label>
              <input type="password" class="form-input" value="sanbonglon2026" required />
            </div>
            <button type="submit" class="btn btn-lime">Đăng nhập ca trực & Vào hệ thống</button>
          </form>
        </div>
      </main>
      <footer style="text-align:center;font-size:12px;color:var(--text-muted);">SANBONGLON Operational Shell</footer>
    </div>
  </body>
</html>`;

const publicSiteHtml = `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Trang Chủ & Lịch Sân Công Khai – SANBONGLON</title>
    <link rel="stylesheet" href="/css/variables.css" />
    <link rel="stylesheet" href="/css/global.css" />
    <link rel="stylesheet" href="/css/layout.css" />
    <link rel="stylesheet" href="/css/components.css" />
  </head>
  <body data-standalone="true">
    <header class="sbl-top-header">
      <div class="font-editorial" style="font-size:20px;font-weight:700;">SANBONGLON</div>
      <div style="display:flex;gap:12px;">
        <a href="/pages/login.html" class="btn btn-secondary btn-sm">Đăng nhập ca trực</a>
        <a href="/pages/dashboard.html" class="btn btn-primary btn-sm">Vào trang Quản trị</a>
      </div>
    </header>
    <main class="sbl-main-content">
      <div class="sbl-page-header">
        <div>
          <h1 class="sbl-page-title">Lịch Sân Công Khai & Bảng Giá Đặt (Sân 01 đến 12)</h1>
          <p class="sbl-page-subtitle">Tổ hợp 12 sân cỏ FIFA Pro – Mở cửa 07:00 – 24:00 – Hotline & Zalo đặt sân: 0909 888 789</p>
        </div>
      </div>
      <div class="sbl-panel">
        <div class="sbl-panel-header">
          <h2 class="sbl-panel-title">Bảng Giá Thuê Sân & Liên Hệ Đặt Giữ Sân</h2>
        </div>
        <div class="sbl-panel-body">
          <p>Sân 5 người (Sân 01 đến 08): 220.000 đ/h (07:00–16:00) • 360.000 đ/h (16:00–21:30) • 280.000 đ/h (21:30–24:00)</p>
          <p>Sân 7 người (Sân 09 đến 12): 350.000 đ/h (07:00–16:00) • 580.000 đ/h (16:00–21:30) • 440.000 đ/h (21:30–24:00)</p>
        </div>
      </div>
    </main>
  </body>
</html>`;

// Write to both public/pages and root pages/
for (const baseDir of ['public/pages', 'pages']) {
  fs.mkdirSync(baseDir, { recursive: true });
  for (const page of PAGES) {
    fs.writeFileSync(path.join(baseDir, page.file), buildInternalPageHtml(page), 'utf8');
  }
  fs.writeFileSync(path.join(baseDir, 'login.html'), loginHtml, 'utf8');
}

fs.mkdirSync('public/public', { recursive: true });
fs.writeFileSync('public/public/index.html', publicSiteHtml, 'utf8');

// Mirror public/components, public/css, public/js to root components/, css/, js/
for (const folder of ['components', 'css', 'js']) {
  fs.mkdirSync(folder, { recursive: true });
  const srcDir = path.join('public', folder);
  for (const file of fs.readdirSync(srcDir)) {
    fs.copyFileSync(path.join(srcDir, file), path.join(folder, file));
  }
}

console.log('Generated all modular HTML pages and mirrored components/css/js successfully.');
