## ĐỀ TÀI: HỆ THỐNG QUẢN LÝ VÀ ĐẶT SÂN BÓNG ĐÁ TRỰC TUYẾN

### 1. Xác định đề tài

#### Tên đề tài: Hệ thống quản lý và đặt sân bóng đá trực tuyến (sân 5 người)

Bối cảnh: Mô hình đặt sân hiện tại chủ yếu qua điện thoại/nhắn tin thủ công, dễ trùng lịch, không kiểm soát được khách no-show (đặt xong không đến), và tốn nhân lực để nhắc/xác nhận từng khách. Đề tài xây dựng một hệ thống cho phép khách tự đặt sân trực tuyến, đồng thời tự động hoá chính sách cọc/hoàn cọc để giảm thất thoát doanh thu do no-show.

#### Phạm vi:

Đối tượng sử dụng: khách hàng (không cần tài khoản) và quản lý/nhân viên sân.
Loại sân: đồng nhất sân 5 người (5v5).
Không bao gồm: hệ thống thành viên/tích điểm, ứng dụng di động riêng (giai đoạn đầu chỉ làm web).

### 2. Mục tiêu hệ thống

Mục tiêu tổng quát: Số hoá toàn bộ quy trình đặt sân – thanh toán – xác nhận – sử dụng sân, thay thế cách làm thủ công qua điện thoại.

Mục tiêu cụ thể:

Cho phép khách đặt sân trực tuyến theo thời gian thực, không cần đăng ký tài khoản.
Tự động hoá chính sách đặt cọc (50%) và hoàn cọc theo bậc thời gian khi khách huỷ.
Giảm thất thoát doanh thu do khách đặt sân nhưng không đến (no-show).
Hỗ trợ quản lý theo dõi lịch đặt, xác nhận khách, xử lý ngoại lệ (huỷ/no-show) và xem báo cáo doanh thu theo ca.
Đảm bảo dữ liệu giao dịch (cọc, hoàn cọc) chính xác, có thể đối soát được. 3. Xác định chức năng

### 3.1. Nhóm chức năng dành cho Khách hàng

Mã Chức năng
KH-01 Xem lịch sân trống theo ngày/giờ
KH-02 Đặt sân (nhập tên, SĐT — không cần tài khoản)
KH-03 Thanh toán đặt cọc (50% giá trị sân)
KH-04 Nhận xác nhận đặt sân qua Zalo/điện thoại
KH-05 Chủ động huỷ đặt sân trước giờ hẹn
KH-06 Thanh toán phần còn lại sau khi sử dụng sân

### 3.2. Nhóm chức năng dành cho Quản lý/Nhân viên

Mã Chức năng
QL-01 Tiếp nhận đặt sân qua nhiều kênh (online, gọi điện, trực tiếp)
QL-02 Xác nhận đã nhận cọc
QL-03 Gọi/nhắn xác nhận lại với khách trước giờ hẹn
QL-04 Theo dõi giờ hẹn, check-in khách
QL-05 Xử lý khách không đến (no-show)
QL-06 Xử lý yêu cầu huỷ từ khách, áp dụng bảng hoàn cọc theo bậc
QL-07 Thu tiền còn lại sau khi khách sử dụng sân
QL-08 Xem báo cáo doanh thu, no-show, huỷ theo ca/ngày 4. Mô tả cụ thể các chức năng chính

### 4.1. Đặt sân (KH-01, KH-02, KH-03)

Khách chọn ngày/giờ trống, nhập tên và SĐT (dùng làm khoá định danh khách, không cần tài khoản), sau đó thanh toán cọc 50% giá trị sân. Booking được tạo với trạng thái chờ thanh toán, chuyển sang đã xác nhận sau khi cọc được ghi nhận và nhân viên gọi/nhắn xác nhận lại qua Zalo hoặc điện thoại.

### 4.2. Sử dụng sân & thanh toán phần còn lại (KH-06, QL-04, QL-07)

Đến giờ hẹn, nhân viên check-in khách, khách sử dụng sân, sau khi chơi xong thanh toán nốt 50% còn lại. Booking chuyển sang trạng thái hoàn tất.

### 4.3. Xử lý no-show (QL-04, QL-05)

Nếu quá 20–30 phút (grace period) không thấy khách đến, nhân viên gọi/nhắn Zalo xác nhận:

Khách phản hồi vẫn đến → tiếp tục chờ, giữ booking.
Không phản hồi/xác nhận không đến → huỷ booking, mất cọc hoàn toàn, giải phóng khung giờ cho khách khác, ghi nhận vào lịch sử no-show của khách (theo SĐT).

### 4.4. Khách chủ động huỷ & bảng hoàn cọc theo bậc (KH-05, QL-06)

Áp dụng chung cho mọi khung giờ (không phân biệt giờ cao điểm/thường), tính theo thời gian còn lại đến giờ đặt:

Thời điểm báo huỷ Xử lý cọc
≥ 24 tiếng trước giờ đặt Hoàn 100% cọc / đổi lịch miễn phí
2–24 tiếng trước giờ đặt Hoàn 30%, giữ 20% làm phí xử lý
< 2 tiếng trước giờ đặt Mất cọc hoàn toàn
4.5. Báo cáo cuối ca (QL-08)

Sau mỗi ca/ngày, hệ thống tổng hợp: số booking hoàn tất, số no-show, số huỷ (theo từng mức hoàn cọc), tổng doanh thu thực nhận (bao gồm cả cọc bị giữ lại từ no-show/huỷ trễ).

### 5. Kiến trúc hệ thống: Monolithic (phân lớp bên trong)

Chọn kiến trúc Monolithic (một backend duy nhất, một lần deploy) vì team 5 người, giai đoạn MVP, chưa có nhu cầu scale từng phần riêng biệt. Bên trong monolith, code được tổ chức theo lớp để tránh rối khi hệ thống lớn dần:

┌─────────────────────────────────────────────┐
│ CLIENT LAYER │
│ Web Booking (khách) │ Admin Dashboard (QL)│
└─────────────────────┬─────────────────────────┘
│ REST API (HTTPS)
|
┌─────────────────────▼─────────────────────────┐
│ APPLICATION LAYER (Backend) │
│ Booking Service │ Payment Service │
│ (state machine) │ (cọc, hoàn cọc theo bậc) │
│ Scheduler/Worker │ Notification Service │
│ (grace period, │ (Zalo / SMS / call) │
│ auto-cancel) │ │
└─────────────────────┬─────────────────────────┘
│
|
┌─────────────────────▼─────────────────────────┐
│ DATA LAYER — Relational DB (PostgreSQL) │
│ Customer, Court, Booking, Payment, RefundLog │

└─────────────────────────────────────────────────┘

Lý do dùng database quan hệ: nghiệp vụ có giao dịch tài chính (cọc, hoàn cọc) cần tính toàn vẹn dữ liệu (ACID) và các bảng có quan hệ chặt với nhau (1 booking có nhiều payment, nhiều refund log).

### 6. Phân chia công việc (5 người)

        Vai trò Người phụ trách Đầu ra chính
        Leader — SA/BA Bạn State machine, sequence diagram, API contract, tài liệu đặc tả nghiệp vụ (dựa trên mục 3, 4 ở trên)
        Data 1 người ERD chi tiết, schema database, migration script (dựa trên mục 5)
        Backend 1 người Booking/Payment/Notification/Scheduler service, engine tính cọc & hoàn cọc theo bậc
        Frontend 1 người Web booking (khách) + Admin dashboard (quản lý)
        Tester + Docs 1 người Test case matrix theo từng chức năng ở mục 3–4, tài liệu đặc tả tổng hợp

Thứ tự triển khai đề xuất:

Leader hoàn thiện tài liệu SA/BA (state machine + API contract) từ mục 3–4.
Data dựng schema dựa trên tài liệu SA; song song Tester bắt đầu viết test case từ bảng chức năng.
Backend & Frontend triển khai song song sau khi có schema và API contract.
Leader hỗ trợ Backend trước (vùng rủi ro nghiệp vụ cao — tính cọc/hoàn cọc), sau đó hỗ trợ Frontend nếu còn thời gian.
