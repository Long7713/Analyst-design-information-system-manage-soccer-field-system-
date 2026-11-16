-- =====================================================================
-- HỆ THỐNG QUẢN LÝ SÂN BÓNG ĐÁ MINI NHÂN TẠO  -  MySQL 8.0+
-- Chạy file này trong MySQL Workbench (Ctrl + Shift + Enter)
-- =====================================================================
DROP DATABASE IF EXISTS quan_ly_san_bong;
CREATE DATABASE quan_ly_san_bong CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE quan_ly_san_bong;

-- ============================ NHÓM 1: NHÂN SỰ ============================
CREATE TABLE nhan_vien (
  ma_nv          INT AUTO_INCREMENT PRIMARY KEY,
  ho_ten         VARCHAR(100) NOT NULL,
  so_dien_thoai  VARCHAR(15),
  ngay_sinh      DATE,
  dia_chi        VARCHAR(255),
  ngay_vao_lam   DATE,
  muc_luong_gio  BIGINT NOT NULL DEFAULT 50000,
  trang_thai     VARCHAR(20) NOT NULL DEFAULT 'dang_lam',
  CONSTRAINT ck_nv_tt CHECK (trang_thai IN ('dang_lam','nghi_viec','tam_khoa'))
);

-- (Bổ sung) Tài khoản đăng nhập + phân quyền: QUAN_LY / NHAN_VIEN
CREATE TABLE tai_khoan (
  ma_tk          INT AUTO_INCREMENT PRIMARY KEY,
  ma_nv          INT NOT NULL UNIQUE,
  ten_dang_nhap  VARCHAR(50) NOT NULL UNIQUE,
  mat_khau       VARCHAR(100) NOT NULL,           -- mã hóa BCrypt
  vai_tro        VARCHAR(20) NOT NULL DEFAULT 'NHAN_VIEN',
  trang_thai     VARCHAR(20) NOT NULL DEFAULT 'hoat_dong',
  CONSTRAINT fk_tk_nv FOREIGN KEY (ma_nv) REFERENCES nhan_vien(ma_nv),
  CONSTRAINT ck_tk_vt CHECK (vai_tro IN ('QUAN_LY','NHAN_VIEN')),
  CONSTRAINT ck_tk_tt CHECK (trang_thai IN ('hoat_dong','tam_khoa'))
);

CREATE TABLE ca_lam_viec (
  ma_ca          INT AUTO_INCREMENT PRIMARY KEY,
  ma_nv          INT NOT NULL,
  ngay_lam       DATE NOT NULL,
  gio_bat_dau    TIME NOT NULL,
  gio_ket_thuc   TIME NOT NULL,                   -- 00:00:00 được hiểu là 24:00
  muc_luong_gio  BIGINT NOT NULL,
  CONSTRAINT fk_ca_nv FOREIGN KEY (ma_nv) REFERENCES nhan_vien(ma_nv)
);

-- ================= NHÓM 2: SÂN BÓNG, GIÁ SÂN, KHÁCH HÀNG =================
CREATE TABLE san_bong (
  ma_san      INT PRIMARY KEY,                    -- 1..12  =>  "Sân 01".."Sân 12"
  trang_thai  VARCHAR(20) NOT NULL DEFAULT 'hoat_dong',
  ghi_chu     VARCHAR(255),
  CONSTRAINT ck_san_tt CHECK (trang_thai IN ('hoat_dong','ngung_hoat_dong'))
);

CREATE TABLE bang_gia (
  ma_bang_gia   INT AUTO_INCREMENT PRIMARY KEY,
  loai_ngay     VARCHAR(20) NOT NULL,             -- ngay_thuong / cuoi_tuan
  gio_bat_dau   TIME NOT NULL,
  gio_ket_thuc  TIME NOT NULL,                    -- 00:00:00 = 24:00
  gia_moi_gio   BIGINT NOT NULL,
  ap_dung_tu    DATE NULL,                        -- (bổ sung) thời gian áp dụng, NULL = không giới hạn
  ap_dung_den   DATE NULL,
  kich_hoat     TINYINT(1) NOT NULL DEFAULT 1,    -- (bổ sung) bật/tắt bảng giá
  CONSTRAINT ck_bg_loai CHECK (loai_ngay IN ('ngay_thuong','cuoi_tuan'))
);

CREATE TABLE khach_hang (
  ma_kh          INT AUTO_INCREMENT PRIMARY KEY,
  ten_kh         VARCHAR(100) NOT NULL,
  so_dien_thoai  VARCHAR(15) NOT NULL UNIQUE,
  ghi_chu        VARCHAR(500)
);

-- ========================= NHÓM 3: ĐẶT SÂN =========================
CREATE TABLE dat_san (
  ma_dat_san         INT AUTO_INCREMENT PRIMARY KEY,
  ma_kh              INT NOT NULL,
  ma_san             INT NOT NULL,
  ngay_dat           DATE NOT NULL,
  gio_bat_dau        TIME NOT NULL,
  gio_ket_thuc       TIME NOT NULL,               -- 00:00:00 = 24:00
  tien_san           BIGINT NOT NULL,
  tien_coc           BIGINT NOT NULL DEFAULT 0,
  trang_thai         VARCHAR(20) NOT NULL DEFAULT 'cho_xac_nhan',
  ma_nv_tao          INT NULL,
  thoi_gian_huy      DATETIME NULL,
  ma_nv_huy          INT NULL,
  thoi_gian_boom     DATETIME NULL,
  ma_nv_boom         INT NULL,
  tien_coc_giu_lai   BIGINT NULL,
  ghi_chu            VARCHAR(500),
  thoi_gian_tao      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ds_kh   FOREIGN KEY (ma_kh)     REFERENCES khach_hang(ma_kh),
  CONSTRAINT fk_ds_san  FOREIGN KEY (ma_san)    REFERENCES san_bong(ma_san),
  CONSTRAINT fk_ds_nvt  FOREIGN KEY (ma_nv_tao) REFERENCES nhan_vien(ma_nv),
  CONSTRAINT fk_ds_nvh  FOREIGN KEY (ma_nv_huy) REFERENCES nhan_vien(ma_nv),
  CONSTRAINT fk_ds_nvb  FOREIGN KEY (ma_nv_boom) REFERENCES nhan_vien(ma_nv),
  CONSTRAINT ck_ds_tt CHECK (trang_thai IN
     ('cho_xac_nhan','da_xac_nhan','dang_da','da_da_xong','da_huy','khach_boom')),
  INDEX idx_ds_san_ngay (ma_san, ngay_dat),
  INDEX idx_ds_ngay (ngay_dat)
);

CREATE TABLE them_gio (
  ma_them_gio        INT AUTO_INCREMENT PRIMARY KEY,
  ma_dat_san         INT NOT NULL,
  gio_ket_thuc_moi   TIME NOT NULL,
  so_phut_them       INT NOT NULL,
  tien_them_gio      BIGINT NOT NULL,
  thoi_diem_them     DATETIME NOT NULL,
  ma_nv              INT NULL,
  CONSTRAINT fk_tg_ds FOREIGN KEY (ma_dat_san) REFERENCES dat_san(ma_dat_san),
  CONSTRAINT fk_tg_nv FOREIGN KEY (ma_nv) REFERENCES nhan_vien(ma_nv),
  CONSTRAINT ck_tg_phut CHECK (so_phut_them > 0 AND so_phut_them % 30 = 0)
);

-- (Bổ sung) Lịch sử đổi thời gian: giờ cũ, giờ mới, thời điểm, nhân viên
CREATE TABLE lich_su_doi_gio (
  ma_doi          INT AUTO_INCREMENT PRIMARY KEY,
  ma_dat_san      INT NOT NULL,
  bat_dau_cu      TIME NOT NULL,
  ket_thuc_cu     TIME NOT NULL,
  bat_dau_moi     TIME NOT NULL,
  ket_thuc_moi    TIME NOT NULL,
  tien_san_cu     BIGINT NOT NULL,
  tien_san_moi    BIGINT NOT NULL,
  thoi_diem_doi   DATETIME NOT NULL,
  ma_nv           INT NULL,
  CONSTRAINT fk_ld_ds FOREIGN KEY (ma_dat_san) REFERENCES dat_san(ma_dat_san),
  CONSTRAINT fk_ld_nv FOREIGN KEY (ma_nv) REFERENCES nhan_vien(ma_nv)
);

CREATE TABLE hoa_don_dat_san (
  ma_hoa_don   INT AUTO_INCREMENT PRIMARY KEY,
  ma_dat_san   INT NOT NULL UNIQUE,
  ngay_lap     DATE NOT NULL,
  ma_nv_lap    INT NULL,
  ghi_chu      VARCHAR(500),
  CONSTRAINT fk_hd_ds FOREIGN KEY (ma_dat_san) REFERENCES dat_san(ma_dat_san),
  CONSTRAINT fk_hd_nv FOREIGN KEY (ma_nv_lap) REFERENCES nhan_vien(ma_nv)
);

-- ======================= NHÓM 4: DỊCH VỤ BÁN HÀNG =======================
CREATE TABLE san_pham (
  ma_san_pham           INT AUTO_INCREMENT PRIMARY KEY,
  ten_san_pham          VARCHAR(100) NOT NULL,
  loai_san_pham         VARCHAR(50),
  don_vi_tinh           VARCHAR(20) DEFAULT 'cái',
  gia_ban               BIGINT NOT NULL,
  so_luong_ton          INT NOT NULL DEFAULT 0,
  muc_ton_toi_thieu     INT NOT NULL DEFAULT 5,
  trang_thai_kinh_doanh VARCHAR(20) NOT NULL DEFAULT 'dang_ban',
  ghi_chu               VARCHAR(255),
  CONSTRAINT ck_sp_tt CHECK (trang_thai_kinh_doanh IN ('dang_ban','ngung_ban','het_hang')),
  CONSTRAINT ck_sp_ton CHECK (so_luong_ton >= 0)
);

-- (Bổ sung) Giao dịch bán dịch vụ tại sân
CREATE TABLE hoa_don_dich_vu (
  ma_hd_dv    INT AUTO_INCREMENT PRIMARY KEY,
  thoi_gian   DATETIME NOT NULL,
  ma_nv       INT NULL,
  tong_tien   BIGINT NOT NULL,
  CONSTRAINT fk_hddv_nv FOREIGN KEY (ma_nv) REFERENCES nhan_vien(ma_nv)
);
CREATE TABLE chi_tiet_hoa_don_dv (
  ma_ct        INT AUTO_INCREMENT PRIMARY KEY,
  ma_hd_dv     INT NOT NULL,
  ma_san_pham  INT NOT NULL,
  so_luong     INT NOT NULL,
  don_gia      BIGINT NOT NULL,
  CONSTRAINT fk_cthd_hd FOREIGN KEY (ma_hd_dv) REFERENCES hoa_don_dich_vu(ma_hd_dv),
  CONSTRAINT fk_cthd_sp FOREIGN KEY (ma_san_pham) REFERENCES san_pham(ma_san_pham)
);
-- (Bổ sung) Ghi nhận hàng hỏng: Tồn cuối = Tồn đầu + Nhập - Bán - Hỏng
CREATE TABLE hang_hong (
  ma_hang_hong INT AUTO_INCREMENT PRIMARY KEY,
  ma_san_pham  INT NOT NULL,
  so_luong     INT NOT NULL,
  ly_do        VARCHAR(255),
  thoi_gian    DATETIME NOT NULL,
  ma_nv        INT NULL,
  CONSTRAINT fk_hh_sp FOREIGN KEY (ma_san_pham) REFERENCES san_pham(ma_san_pham),
  CONSTRAINT fk_hh_nv FOREIGN KEY (ma_nv) REFERENCES nhan_vien(ma_nv)
);

-- ================= NHÓM 5: KHO THIẾT BỊ VÀ NHẬP HÀNG =================
CREATE TABLE thiet_bi (
  ma_thiet_bi    INT AUTO_INCREMENT PRIMARY KEY,
  ten_thiet_bi   VARCHAR(100) NOT NULL,
  loai_thiet_bi  VARCHAR(50),
  so_luong       INT NOT NULL DEFAULT 0,          -- tổng = tổng 5 tình trạng bên dưới (code tự cập nhật)
  sl_dang_dung   INT NOT NULL DEFAULT 0,
  sl_trong_kho   INT NOT NULL DEFAULT 0,
  sl_hong        INT NOT NULL DEFAULT 0,
  sl_dang_sua    INT NOT NULL DEFAULT 0,
  sl_thanh_ly    INT NOT NULL DEFAULT 0,
  ngay_nhap      DATE,
  ghi_chu        VARCHAR(255)
);

CREATE TABLE chi_tiet_thiet_bi (
  ma_ct_tb     INT AUTO_INCREMENT PRIMARY KEY,
  ma_thiet_bi  INT NOT NULL,
  ten_chi_tiet VARCHAR(100) NOT NULL,             -- ví dụ: "Khung thành sân 1"
  ma_san       INT NULL,
  tinh_trang   VARCHAR(20) NOT NULL DEFAULT 'dang_dung',
  ghi_chu      VARCHAR(255),
  CONSTRAINT fk_ctt_tb  FOREIGN KEY (ma_thiet_bi) REFERENCES thiet_bi(ma_thiet_bi),
  CONSTRAINT fk_ctt_san FOREIGN KEY (ma_san) REFERENCES san_bong(ma_san),
  CONSTRAINT ck_ctt_tt CHECK (tinh_trang IN ('dang_dung','trong_kho','hong','dang_sua','thanh_ly'))
);

CREATE TABLE phieu_bao_tri (
  ma_bao_tri         INT AUTO_INCREMENT PRIMARY KEY,
  ma_thiet_bi        INT NOT NULL,
  so_luong           INT NOT NULL,
  ngay_bat_dau_sua   DATE NOT NULL,
  noi_dung_sua_chua  VARCHAR(500),
  chi_phi            BIGINT DEFAULT 0,
  ngay_hoan_thanh    DATE NULL,
  trang_thai         VARCHAR(20) NOT NULL DEFAULT 'dang_sua',
  ma_nv              INT NULL,
  CONSTRAINT fk_bt_tb FOREIGN KEY (ma_thiet_bi) REFERENCES thiet_bi(ma_thiet_bi),
  CONSTRAINT fk_bt_nv FOREIGN KEY (ma_nv) REFERENCES nhan_vien(ma_nv),
  CONSTRAINT ck_bt_tt CHECK (trang_thai IN ('dang_sua','da_hoan_thanh'))
);

CREATE TABLE nha_cung_cap (
  ma_ncc         INT AUTO_INCREMENT PRIMARY KEY,
  ten_ncc        VARCHAR(150) NOT NULL,
  so_dien_thoai  VARCHAR(15),
  dia_chi        VARCHAR(255),
  email          VARCHAR(100),
  nguoi_lien_he  VARCHAR(100),
  ghi_chu        VARCHAR(255)
);

CREATE TABLE phieu_nhap (
  ma_phieu_nhap  INT AUTO_INCREMENT PRIMARY KEY,
  ngay_nhap      DATE NOT NULL,
  ma_nv          INT NULL,
  ma_ncc         INT NULL,
  trang_thai     VARCHAR(20) NOT NULL DEFAULT 'nhap',
  ghi_chu        VARCHAR(255),
  CONSTRAINT fk_pn_nv  FOREIGN KEY (ma_nv)  REFERENCES nhan_vien(ma_nv),
  CONSTRAINT fk_pn_ncc FOREIGN KEY (ma_ncc) REFERENCES nha_cung_cap(ma_ncc),
  CONSTRAINT ck_pn_tt CHECK (trang_thai IN ('nhap','cho_xac_nhan','da_xac_nhan','da_huy'))
);

CREATE TABLE chi_tiet_phieu_nhap (
  ma_chi_tiet    INT AUTO_INCREMENT PRIMARY KEY,
  ma_phieu_nhap  INT NOT NULL,
  ma_san_pham    INT NULL,
  ma_thiet_bi    INT NULL,
  so_luong       INT NOT NULL,
  don_gia        BIGINT NOT NULL,
  CONSTRAINT fk_ctpn_pn FOREIGN KEY (ma_phieu_nhap) REFERENCES phieu_nhap(ma_phieu_nhap),
  CONSTRAINT fk_ctpn_sp FOREIGN KEY (ma_san_pham)   REFERENCES san_pham(ma_san_pham),
  CONSTRAINT fk_ctpn_tb FOREIGN KEY (ma_thiet_bi)   REFERENCES thiet_bi(ma_thiet_bi),
  -- mỗi dòng chỉ chứa sản phẩm HOẶC thiết bị
  CONSTRAINT ck_ctpn_loai CHECK ((ma_san_pham IS NULL AND ma_thiet_bi IS NOT NULL)
                              OR (ma_san_pham IS NOT NULL AND ma_thiet_bi IS NULL))
);

-- (Bổ sung) Nhật ký hoạt động
CREATE TABLE nhat_ky (
  ma_nhat_ky  INT AUTO_INCREMENT PRIMARY KEY,
  ma_nv       INT NULL,
  thao_tac    VARCHAR(50) NOT NULL,
  doi_tuong   VARCHAR(100),
  noi_dung    VARCHAR(500),
  thoi_gian   DATETIME NOT NULL,
  CONSTRAINT fk_nk_nv FOREIGN KEY (ma_nv) REFERENCES nhan_vien(ma_nv),
  INDEX idx_nk_tg (thoi_gian)
);
