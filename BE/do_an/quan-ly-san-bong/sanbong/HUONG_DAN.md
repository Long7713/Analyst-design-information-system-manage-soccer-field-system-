# Hệ thống quản lý sân bóng đá mini nhân tạo (Java Spring Boot + MySQL)

## 1. Chạy thử (3 bước)
1. **Tạo DB**: mở MySQL Workbench → mở lần lượt `database/01_tao_database.sql` rồi `database/02_du_lieu_mau.sql` → bấm ⚡ (Ctrl+Shift+Enter) chạy.
2. **Sửa kết nối**: đặt biến môi trường `DB_USERNAME` và `DB_PASSWORD`, hoặc tạo `src/main/resources/application-local.properties` với `spring.datasource.username` và `spring.datasource.password` của máy bạn. File cấu hình riêng này được tự động nạp và được Git bỏ qua; không lưu mật khẩu thật vào `application.properties`.
3. **Chạy**: cần JDK 17+ và Maven.  `mvn spring-boot:run`  (hoặc mở thư mục bằng IntelliJ/Eclipse → chạy `SanBongApplication`). Mở http://localhost:8080

Tài khoản mẫu: `admin / admin123` (Quản lý) · `nhanvien1 / 123456` (Nhân viên).

## 2. CHỖ KẾT NỐI SPRING ↔ MYSQL
File **`src/main/resources/application.properties`**:
| Dòng | Ý nghĩa |
|---|---|
| `spring.datasource.url` | địa chỉ MySQL + tên DB (`localhost:3306/quan_ly_san_bong`) – đổi nếu MySQL ở cổng/máy khác |
| `spring.datasource.username` | tài khoản MySQL |
| `spring.datasource.password` | mật khẩu MySQL |
| `spring.jpa.hibernate.ddl-auto=none` | Spring KHÔNG tự tạo/sửa bảng, bảng do file .sql quản lý |

## 3. Cấu trúc
- `entity/` ánh xạ bảng · `repository/` truy vấn · `service/` nghiệp vụ (DatSanService là lõi) · `controller/` trang web · `api/` JSON kiểm tra sân trống
- `templates/` giao diện Thymeleaf · `static/css|js` style & script

## 4. Những chỗ cần bạn xác nhận / chỉnh
- Mọi quy định số nằm ở `util/QuyDinh.java` (cọc 40%, giữ 60% khi hủy sớm, 3 tiếng, boom sau 20 phút, thêm giờ trong 20 phút cuối, 50.000đ/30 phút…).
- Tài liệu có điểm mâu thuẫn, mình đã chọn như sau (đổi trong code nếu muốn khác):
  1. Cách tính giá khi đi qua 2 khung giờ: mặc định **tính từng khung** (theo Đặc tả: 16–20h = 1.410.000). Muốn tính theo khung giờ bắt đầu (ghi chú trong file DB) → `app.gia.theo-gio-bat-dau=true` trong application.properties.
  2. Tiền cọc: DB ghi 40%, Đặc tả ghi 50% → dùng **40%** (và hủy ≥3h: giữ 60%, hoàn 40%).
  3. Thêm giờ: dùng quy tắc "đang đá và còn ≤ 20 phút trước giờ kết thúc" (ví dụ 16:40 trong tài liệu ngược với quy tắc này).
  4. Boom: cho phép sau giờ bắt đầu **20 phút** mà khách chưa đến.
  5. Bỏ `loai_san` (chỉ dùng sân 5 người) theo ghi chú của bạn.
- Các bảng/cột mình **bổ sung** vì nghiệp vụ cần mà file DB chưa có: `tai_khoan`, `nhat_ky`, `lich_su_doi_gio`, `nha_cung_cap`, `hoa_don_dich_vu` + `chi_tiet_hoa_don_dv`, `hang_hong`, cột `gia_moi_gio/ap_dung_tu/ap_dung_den/kich_hoat` của `bang_gia`, `don_vi_tinh/muc_ton_toi_thieu/ghi_chu` của `san_pham`, `ma_ncc` của `phieu_nhap`, trạng thái đơn `cho_xac_nhan` (Chờ cọc – có trong demo), cột `ghi_chu/thoi_gian_tao` của `dat_san`.
- Giờ kết thúc 24:00 lưu là `00:00:00` (code tự hiểu là 24:00).
