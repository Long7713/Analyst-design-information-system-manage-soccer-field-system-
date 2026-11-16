USE quan_ly_san_bong;

-- 12 sân
INSERT INTO san_bong (ma_san, trang_thai) VALUES
(1,'hoat_dong'),(2,'hoat_dong'),(3,'hoat_dong'),(4,'hoat_dong'),(5,'hoat_dong'),(6,'hoat_dong'),
(7,'hoat_dong'),(8,'hoat_dong'),(9,'hoat_dong'),(10,'hoat_dong'),(11,'hoat_dong'),(12,'hoat_dong');

-- Bảng giá (gio_ket_thuc 00:00:00 = 24:00)
INSERT INTO bang_gia (loai_ngay, gio_bat_dau, gio_ket_thuc, gia_moi_gio) VALUES
('ngay_thuong','07:00:00','17:00:00',330000),
('ngay_thuong','17:00:00','00:00:00',360000),
('cuoi_tuan'  ,'07:00:00','17:00:00',350000),
('cuoi_tuan'  ,'17:00:00','00:00:00',380000);

-- Nhân viên + tài khoản.  Mật khẩu: admin / admin123  ;  nhanvien1, nhanvien2 / 123456
INSERT INTO nhan_vien (ho_ten, so_dien_thoai, ngay_sinh, dia_chi, ngay_vao_lam, muc_luong_gio, trang_thai) VALUES
('Trương Thịnh Phát','0901000001','1999-05-12','Quận 1, TP.HCM','2025-01-10',50000,'dang_lam'),
('Nguyễn Minh Khôi' ,'0901000002','2001-08-20','Quận 3, TP.HCM','2025-06-01',50000,'dang_lam'),
('Lê Thu Hà'        ,'0901000003','2002-02-02','Quận 10, TP.HCM','2026-01-15',50000,'dang_lam');
INSERT INTO tai_khoan (ma_nv, ten_dang_nhap, mat_khau, vai_tro) VALUES
(1,'admin'    ,'$2a$10$BVy4tB9U3EGj2VEYWmR7gO68iRSEMF1DjLgs2ftFLIM8Al0n4vk6u','QUAN_LY'),
(2,'nhanvien1','$2a$10$zcngMRRq6Fa0ndvgAENwwu.vcZAQYpEnnw5NeGUeYdhT.cAJbW7.a','NHAN_VIEN'),
(3,'nhanvien2','$2a$10$zcngMRRq6Fa0ndvgAENwwu.vcZAQYpEnnw5NeGUeYdhT.cAJbW7.a','NHAN_VIEN');

-- Ca làm việc 6 ngày gần đây
INSERT INTO ca_lam_viec (ma_nv, ngay_lam, gio_bat_dau, gio_ket_thuc, muc_luong_gio) VALUES
(2, CURDATE() - INTERVAL 1 DAY,'07:00:00','15:00:00',50000),
(3, CURDATE() - INTERVAL 1 DAY,'15:00:00','23:00:00',50000),
(2, CURDATE() - INTERVAL 2 DAY,'07:00:00','15:00:00',50000),
(3, CURDATE() - INTERVAL 2 DAY,'15:00:00','23:00:00',50000),
(2, CURDATE(),'07:00:00','15:00:00',50000),
(3, CURDATE(),'15:00:00','00:00:00',50000);

-- Khách hàng
INSERT INTO khach_hang (ten_kh, so_dien_thoai, ghi_chu) VALUES
('FC Gò Vấp'        ,'0912000001',NULL),
('FC Bình Thạnh'    ,'0912000002','Hay đá tối'),
('Anh Tuấn - Q7'    ,'0912000003',NULL),
('Đội Công Ty ABC'  ,'0912000004','Đá thứ 6 hàng tuần'),
('Chị Lan - Phú Nhuận','0912000005',NULL),
('FC Tự Do Quận 3'  ,'0912000006','Đã từng boom sân'),
('Anh Hùng - Q10'   ,'0912000007',NULL),
('FC Thủ Đức United','0912000008',NULL);

-- Đơn đặt sân HÔM NAY (đủ các trạng thái để xem giao diện)
INSERT INTO dat_san (ma_kh,ma_san,ngay_dat,gio_bat_dau,gio_ket_thuc,tien_san,tien_coc,trang_thai,ma_nv_tao,tien_coc_giu_lai,thoi_gian_huy,ma_nv_huy,thoi_gian_boom,ma_nv_boom) VALUES
(1, 1, CURDATE(),'08:00:00','10:00:00', 660000,264000,'da_da_xong',2,NULL,NULL,NULL,NULL,NULL),
(2, 2, CURDATE(),'09:00:00','10:30:00', 495000,198000,'da_da_xong',2,NULL,NULL,NULL,NULL,NULL),
(3, 5, CURDATE(),'13:00:00','14:30:00', 495000,198000,'da_da_xong',3,NULL,NULL,NULL,NULL,NULL),
(4, 4, CURDATE(),'15:00:00','17:00:00', 660000,264000,'dang_da'   ,3,NULL,NULL,NULL,NULL,NULL),
(5, 6, CURDATE(),'18:00:00','20:00:00', 720000,288000,'da_xac_nhan',3,NULL,NULL,NULL,NULL,NULL),
(6, 3, CURDATE(),'17:30:00','19:00:00', 540000,216000,'khach_boom',2,216000,NULL,NULL,CURDATE() + INTERVAL 1085 MINUTE,2),
(7, 8, CURDATE(),'19:00:00','20:00:00', 360000,144000,'cho_xac_nhan',2,NULL,NULL,NULL,NULL,NULL),
(8, 9, CURDATE(),'20:00:00','22:00:00', 720000,288000,'da_xac_nhan',3,NULL,NULL,NULL,NULL,NULL),
(2,10, CURDATE(),'21:00:00','22:00:00', 360000,144000,'da_huy'    ,2,144000,CURDATE() + INTERVAL 600 MINUTE,2,NULL,NULL);

-- Đơn các ngày trước (để có số liệu thống kê / biểu đồ)
INSERT INTO dat_san (ma_kh,ma_san,ngay_dat,gio_bat_dau,gio_ket_thuc,tien_san,tien_coc,trang_thai,ma_nv_tao) VALUES
(1, 1, CURDATE() - INTERVAL 1 DAY,'18:00:00','20:00:00',720000,288000,'da_da_xong',2),
(2, 2, CURDATE() - INTERVAL 1 DAY,'19:00:00','21:00:00',720000,288000,'da_da_xong',3),
(4, 3, CURDATE() - INTERVAL 1 DAY,'17:00:00','18:30:00',540000,216000,'da_da_xong',3),
(3, 5, CURDATE() - INTERVAL 2 DAY,'08:00:00','09:00:00',330000,132000,'da_da_xong',2),
(5, 6, CURDATE() - INTERVAL 2 DAY,'20:00:00','22:00:00',720000,288000,'da_da_xong',3),
(1, 1, CURDATE() - INTERVAL 3 DAY,'18:00:00','19:30:00',540000,216000,'da_da_xong',2),
(8, 4, CURDATE() - INTERVAL 3 DAY,'19:00:00','21:00:00',720000,288000,'da_da_xong',3),
(4, 2, CURDATE() - INTERVAL 4 DAY,'17:00:00','19:00:00',720000,288000,'da_da_xong',2),
(7, 7, CURDATE() - INTERVAL 4 DAY,'21:00:00','22:00:00',360000,144000,'da_da_xong',3),
(2, 8, CURDATE() - INTERVAL 5 DAY,'18:00:00','20:00:00',720000,288000,'da_da_xong',2),
(6, 3, CURDATE() - INTERVAL 5 DAY,'19:00:00','20:00:00',360000,144000,'khach_boom',2),
(1, 9, CURDATE() - INTERVAL 6 DAY,'18:00:00','20:00:00',720000,288000,'da_da_xong',3),
(3,11, CURDATE() - INTERVAL 6 DAY,'08:00:00','10:00:00',660000,264000,'da_da_xong',2);
UPDATE dat_san SET tien_coc_giu_lai = tien_coc, thoi_gian_boom = ngay_dat + INTERVAL 1200 MINUTE, ma_nv_boom = 2
 WHERE trang_thai='khach_boom' AND tien_coc_giu_lai IS NULL;

-- Thêm giờ + hóa đơn mẫu
INSERT INTO them_gio (ma_dat_san, gio_ket_thuc_moi, so_phut_them, tien_them_gio, thoi_diem_them, ma_nv)
VALUES (10,'20:30:00',30,50000, NOW() - INTERVAL 1 DAY, 2);
UPDATE dat_san SET gio_ket_thuc='20:30:00' WHERE ma_dat_san=10;
INSERT INTO hoa_don_dat_san (ma_dat_san, ngay_lap, ma_nv_lap, ghi_chu) VALUES
(1, CURDATE(), 2, 'Nếu quý khách sử dụng thêm giờ, mỗi 30 phút được tính 50.000 VNĐ.');

-- Sản phẩm dịch vụ
INSERT INTO san_pham (ten_san_pham, loai_san_pham, don_vi_tinh, gia_ban, so_luong_ton, muc_ton_toi_thieu) VALUES
('Nước suối','Nước uống','chai',10000,120,30),
('Coca-Cola','Nước uống','lon',15000,60,20),
('Revive','Nước uống','chai',15000,45,15),
('Bò húc','Nước uống','lon',20000,24,10),
('Mì tôm ly','Đồ ăn nhanh','ly',20000,40,10),
('Bánh snack','Đồ ăn nhanh','gói',12000,50,10),
('Xúc xích','Đồ ăn nhanh','cây',15000,8,10),
('Khăn lạnh','Khác','cái',5000,100,20);
INSERT INTO hoa_don_dich_vu (thoi_gian, ma_nv, tong_tien) VALUES
(NOW() - INTERVAL 3 HOUR, 2, 70000), (NOW() - INTERVAL 1 DAY, 3, 95000);
INSERT INTO chi_tiet_hoa_don_dv (ma_hd_dv, ma_san_pham, so_luong, don_gia) VALUES
(1,1,3,10000),(1,5,2,20000),(2,2,3,15000),(2,6,2,12000),(2,4,1,20000)
;
-- Thiết bị
INSERT INTO thiet_bi (ten_thiet_bi, loai_thiet_bi, so_luong, sl_dang_dung, sl_trong_kho, sl_hong, sl_dang_sua, sl_thanh_ly, ngay_nhap) VALUES
('Khung thành','Thiết bị sân',26,24,2,0,0,0,'2025-01-05'),
('Đèn sân','Thiết bị sân',48,44,2,2,0,0,'2025-01-05'),
('Thảm cỏ nhân tạo (m2)','Mặt sân',3600,3600,0,0,0,0,'2025-01-05'),
('Cao su hạt','Mặt sân',100,60,40,0,0,0,'2025-01-05'),
('Bóng đá','Dụng cụ',50,35,10,5,0,0,'2025-03-01'),
('Áo lưới','Dụng cụ',60,40,15,5,0,0,'2025-03-01');
INSERT INTO chi_tiet_thiet_bi (ma_thiet_bi, ten_chi_tiet, ma_san, tinh_trang) VALUES
(1,'Khung thành sân 1',1,'dang_dung'),(1,'Khung thành sân 2',2,'dang_dung'),
(1,'Khung thành dự phòng',NULL,'trong_kho'),(2,'Đèn sân 3 - cột phía Đông',3,'hong'),
(2,'Đèn sân 7 - cột phía Tây',7,'hong');

INSERT INTO nha_cung_cap (ten_ncc, so_dien_thoai, dia_chi, nguoi_lien_he) VALUES
('Đại lý nước giải khát Minh Phát','0988111222','Quận 12, TP.HCM','Chị Phát'),
('Công ty Thể thao Việt Sport','0988333444','Quận Tân Bình, TP.HCM','Anh Việt');
INSERT INTO phieu_nhap (ngay_nhap, ma_nv, ma_ncc, trang_thai, ghi_chu) VALUES
(CURDATE() - INTERVAL 3 DAY, 1, 1, 'da_xac_nhan', 'Nhập nước đầu tuần'),
(CURDATE(), 1, 1, 'cho_xac_nhan', 'Chờ giao hàng');
INSERT INTO chi_tiet_phieu_nhap (ma_phieu_nhap, ma_san_pham, ma_thiet_bi, so_luong, don_gia) VALUES
(1,1,NULL,100,6000),(1,2,NULL,48,10000),(2,2,NULL,100,10000);

INSERT INTO nhat_ky (ma_nv, thao_tac, doi_tuong, noi_dung, thoi_gian) VALUES
(1,'KHOI_TAO','Hệ thống','Khởi tạo dữ liệu mẫu', NOW());
