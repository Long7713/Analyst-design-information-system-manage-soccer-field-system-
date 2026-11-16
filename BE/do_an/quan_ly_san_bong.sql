CREATE DATABASE  IF NOT EXISTS `quan_ly_san_bong` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `quan_ly_san_bong`;

DROP TABLE IF EXISTS `bang_gia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bang_gia` (
  `ma_bang_gia` int NOT NULL AUTO_INCREMENT,
  `loai_ngay` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gio_bat_dau` time NOT NULL,
  `gio_ket_thuc` time NOT NULL,
  `gia_moi_gio` bigint NOT NULL,
  `ap_dung_tu` date DEFAULT NULL,
  `ap_dung_den` date DEFAULT NULL,
  `kich_hoat` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`ma_bang_gia`),
  CONSTRAINT `ck_bg_loai` CHECK ((`loai_ngay` in (_utf8mb4'ngay_thuong',_utf8mb4'cuoi_tuan')))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bang_gia`
--

LOCK TABLES `bang_gia` WRITE;
/*!40000 ALTER TABLE `bang_gia` DISABLE KEYS */;
INSERT INTO `bang_gia` VALUES (1,'ngay_thuong','07:00:00','17:00:00',330000,NULL,NULL,1),(2,'ngay_thuong','17:00:00','00:00:00',360000,NULL,NULL,1),(3,'cuoi_tuan','07:00:00','17:00:00',350000,NULL,NULL,1),(4,'cuoi_tuan','17:00:00','00:00:00',380000,NULL,NULL,1);
/*!40000 ALTER TABLE `bang_gia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ca_lam_viec`
--

DROP TABLE IF EXISTS `ca_lam_viec`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ca_lam_viec` (
  `ma_ca` int NOT NULL AUTO_INCREMENT,
  `ma_nv` int NOT NULL,
  `ngay_lam` date NOT NULL,
  `gio_bat_dau` time NOT NULL,
  `gio_ket_thuc` time NOT NULL,
  `muc_luong_gio` bigint NOT NULL,
  PRIMARY KEY (`ma_ca`),
  KEY `fk_ca_nv` (`ma_nv`),
  CONSTRAINT `fk_ca_nv` FOREIGN KEY (`ma_nv`) REFERENCES `nhan_vien` (`ma_nv`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ca_lam_viec`
--

LOCK TABLES `ca_lam_viec` WRITE;
/*!40000 ALTER TABLE `ca_lam_viec` DISABLE KEYS */;
INSERT INTO `ca_lam_viec` VALUES (1,2,'2026-10-19','07:00:00','15:00:00',50000),(2,3,'2026-10-19','15:00:00','23:00:00',50000),(3,2,'2026-10-18','07:00:00','15:00:00',50000),(4,3,'2026-10-18','15:00:00','23:00:00',50000),(5,2,'2026-10-20','07:00:00','15:00:00',50000),(6,3,'2026-10-20','15:00:00','00:00:00',50000);
/*!40000 ALTER TABLE `ca_lam_viec` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chi_tiet_hoa_don_dv`
--

DROP TABLE IF EXISTS `chi_tiet_hoa_don_dv`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chi_tiet_hoa_don_dv` (
  `ma_ct` int NOT NULL AUTO_INCREMENT,
  `ma_hd_dv` int NOT NULL,
  `ma_san_pham` int NOT NULL,
  `so_luong` int NOT NULL,
  `don_gia` bigint NOT NULL,
  PRIMARY KEY (`ma_ct`),
  KEY `fk_cthd_hd` (`ma_hd_dv`),
  KEY `fk_cthd_sp` (`ma_san_pham`),
  CONSTRAINT `fk_cthd_hd` FOREIGN KEY (`ma_hd_dv`) REFERENCES `hoa_don_dich_vu` (`ma_hd_dv`),
  CONSTRAINT `fk_cthd_sp` FOREIGN KEY (`ma_san_pham`) REFERENCES `san_pham` (`ma_san_pham`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chi_tiet_hoa_don_dv`
--

LOCK TABLES `chi_tiet_hoa_don_dv` WRITE;
/*!40000 ALTER TABLE `chi_tiet_hoa_don_dv` DISABLE KEYS */;
/*!40000 ALTER TABLE `chi_tiet_hoa_don_dv` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chi_tiet_phieu_nhap`
--

DROP TABLE IF EXISTS `chi_tiet_phieu_nhap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chi_tiet_phieu_nhap` (
  `ma_chi_tiet` int NOT NULL AUTO_INCREMENT,
  `ma_phieu_nhap` int NOT NULL,
  `ma_san_pham` int DEFAULT NULL,
  `ma_thiet_bi` int DEFAULT NULL,
  `so_luong` int NOT NULL,
  `don_gia` bigint NOT NULL,
  PRIMARY KEY (`ma_chi_tiet`),
  KEY `fk_ctpn_pn` (`ma_phieu_nhap`),
  KEY `fk_ctpn_sp` (`ma_san_pham`),
  KEY `fk_ctpn_tb` (`ma_thiet_bi`),
  CONSTRAINT `fk_ctpn_pn` FOREIGN KEY (`ma_phieu_nhap`) REFERENCES `phieu_nhap` (`ma_phieu_nhap`),
  CONSTRAINT `fk_ctpn_sp` FOREIGN KEY (`ma_san_pham`) REFERENCES `san_pham` (`ma_san_pham`),
  CONSTRAINT `fk_ctpn_tb` FOREIGN KEY (`ma_thiet_bi`) REFERENCES `thiet_bi` (`ma_thiet_bi`),
  CONSTRAINT `ck_ctpn_loai` CHECK ((((`ma_san_pham` is null) and (`ma_thiet_bi` is not null)) or ((`ma_san_pham` is not null) and (`ma_thiet_bi` is null))))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chi_tiet_phieu_nhap`
--

LOCK TABLES `chi_tiet_phieu_nhap` WRITE;
/*!40000 ALTER TABLE `chi_tiet_phieu_nhap` DISABLE KEYS */;
/*!40000 ALTER TABLE `chi_tiet_phieu_nhap` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chi_tiet_thiet_bi`
--

DROP TABLE IF EXISTS `chi_tiet_thiet_bi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chi_tiet_thiet_bi` (
  `ma_ct_tb` int NOT NULL AUTO_INCREMENT,
  `ma_thiet_bi` int NOT NULL,
  `ten_chi_tiet` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ma_san` int DEFAULT NULL,
  `tinh_trang` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'dang_dung',
  `ghi_chu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ma_ct_tb`),
  KEY `fk_ctt_tb` (`ma_thiet_bi`),
  KEY `fk_ctt_san` (`ma_san`),
  CONSTRAINT `fk_ctt_san` FOREIGN KEY (`ma_san`) REFERENCES `san_bong` (`ma_san`),
  CONSTRAINT `fk_ctt_tb` FOREIGN KEY (`ma_thiet_bi`) REFERENCES `thiet_bi` (`ma_thiet_bi`),
  CONSTRAINT `ck_ctt_tt` CHECK ((`tinh_trang` in (_utf8mb4'dang_dung',_utf8mb4'trong_kho',_utf8mb4'hong',_utf8mb4'dang_sua',_utf8mb4'thanh_ly')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chi_tiet_thiet_bi`
--

LOCK TABLES `chi_tiet_thiet_bi` WRITE;
/*!40000 ALTER TABLE `chi_tiet_thiet_bi` DISABLE KEYS */;
/*!40000 ALTER TABLE `chi_tiet_thiet_bi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dat_san`
--

DROP TABLE IF EXISTS `dat_san`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dat_san` (
  `ma_dat_san` int NOT NULL AUTO_INCREMENT,
  `ma_kh` int NOT NULL,
  `ma_san` int NOT NULL,
  `ngay_dat` date NOT NULL,
  `gio_bat_dau` time NOT NULL,
  `gio_ket_thuc` time NOT NULL,
  `tien_san` bigint NOT NULL,
  `tien_coc` bigint NOT NULL DEFAULT '0',
  `trang_thai` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cho_xac_nhan',
  `ma_nv_tao` int DEFAULT NULL,
  `thoi_gian_huy` datetime DEFAULT NULL,
  `ma_nv_huy` int DEFAULT NULL,
  `thoi_gian_boom` datetime DEFAULT NULL,
  `ma_nv_boom` int DEFAULT NULL,
  `tien_coc_giu_lai` bigint DEFAULT NULL,
  `ghi_chu` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thoi_gian_tao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ma_dat_san`),
  KEY `fk_ds_kh` (`ma_kh`),
  KEY `fk_ds_nvt` (`ma_nv_tao`),
  KEY `fk_ds_nvh` (`ma_nv_huy`),
  KEY `fk_ds_nvb` (`ma_nv_boom`),
  KEY `idx_ds_san_ngay` (`ma_san`,`ngay_dat`),
  KEY `idx_ds_ngay` (`ngay_dat`),
  CONSTRAINT `fk_ds_kh` FOREIGN KEY (`ma_kh`) REFERENCES `khach_hang` (`ma_kh`),
  CONSTRAINT `fk_ds_nvb` FOREIGN KEY (`ma_nv_boom`) REFERENCES `nhan_vien` (`ma_nv`),
  CONSTRAINT `fk_ds_nvh` FOREIGN KEY (`ma_nv_huy`) REFERENCES `nhan_vien` (`ma_nv`),
  CONSTRAINT `fk_ds_nvt` FOREIGN KEY (`ma_nv_tao`) REFERENCES `nhan_vien` (`ma_nv`),
  CONSTRAINT `fk_ds_san` FOREIGN KEY (`ma_san`) REFERENCES `san_bong` (`ma_san`),
  CONSTRAINT `ck_ds_tt` CHECK ((`trang_thai` in (_utf8mb4'cho_xac_nhan',_utf8mb4'da_xac_nhan',_utf8mb4'dang_da',_utf8mb4'da_da_xong',_utf8mb4'da_huy',_utf8mb4'khach_boom')))
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dat_san`
--

LOCK TABLES `dat_san` WRITE;
/*!40000 ALTER TABLE `dat_san` DISABLE KEYS */;
INSERT INTO `dat_san` VALUES (1,1,1,'2026-10-20','08:00:00','10:00:00',660000,264000,'da_da_xong',2,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-20 08:21:50'),(2,2,2,'2026-10-20','09:00:00','10:30:00',495000,198000,'da_da_xong',2,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-20 08:21:50'),(3,3,5,'2026-10-20','13:00:00','14:30:00',495000,198000,'da_da_xong',3,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-20 08:21:50'),(4,4,4,'2026-10-20','15:00:00','17:00:00',660000,264000,'dang_da',3,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-20 08:21:50'),(5,5,6,'2026-10-20','18:00:00','20:00:00',720000,288000,'da_xac_nhan',3,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-20 08:21:50'),(6,6,3,'2026-10-20','17:30:00','19:00:00',540000,216000,'khach_boom',2,NULL,NULL,'2026-10-20 18:05:00',2,216000,NULL,'2026-10-20 08:21:50'),(7,7,8,'2026-10-20','19:00:00','20:00:00',360000,144000,'cho_xac_nhan',2,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-20 08:21:50'),(8,8,9,'2026-10-20','20:00:00','22:00:00',720000,288000,'da_xac_nhan',3,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-20 08:21:50'),(9,2,10,'2026-10-20','21:00:00','22:00:00',360000,144000,'da_huy',2,'2026-10-20 10:00:00',2,NULL,NULL,144000,NULL,'2026-10-20 08:21:50'),(10,1,1,'2026-10-19','18:00:00','20:00:00',720000,288000,'da_da_xong',2,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-20 08:21:50'),(11,2,2,'2026-10-19','19:00:00','21:00:00',720000,288000,'da_da_xong',3,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-20 08:21:50'),(12,4,3,'2026-10-19','17:00:00','18:30:00',540000,216000,'da_da_xong',3,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-20 08:21:50'),(13,3,5,'2026-10-18','08:00:00','09:00:00',330000,132000,'da_da_xong',2,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-20 08:21:50'),(14,5,6,'2026-10-18','20:00:00','22:00:00',720000,288000,'da_da_xong',3,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-20 08:21:50'),(15,1,1,'2026-10-17','18:00:00','19:30:00',540000,216000,'da_da_xong',2,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-20 08:21:50'),(16,8,4,'2026-10-17','19:00:00','21:00:00',720000,288000,'da_da_xong',3,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-20 08:21:50'),(17,4,2,'2026-10-16','17:00:00','19:00:00',720000,288000,'da_da_xong',2,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-20 08:21:50'),(18,7,7,'2026-10-16','21:00:00','22:00:00',360000,144000,'da_da_xong',3,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-20 08:21:50'),(19,2,8,'2026-10-15','18:00:00','20:00:00',720000,288000,'da_da_xong',2,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-20 08:21:50'),(20,6,3,'2026-10-15','19:00:00','20:00:00',360000,144000,'khach_boom',2,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-20 08:21:50'),(21,1,9,'2026-10-14','18:00:00','20:00:00',720000,288000,'da_da_xong',3,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-20 08:21:50'),(22,3,11,'2026-10-14','08:00:00','10:00:00',660000,264000,'da_da_xong',2,NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-20 08:21:50');
/*!40000 ALTER TABLE `dat_san` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hang_hong`
--

DROP TABLE IF EXISTS `hang_hong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hang_hong` (
  `ma_hang_hong` int NOT NULL AUTO_INCREMENT,
  `ma_san_pham` int NOT NULL,
  `so_luong` int NOT NULL,
  `ly_do` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thoi_gian` datetime NOT NULL,
  `ma_nv` int DEFAULT NULL,
  PRIMARY KEY (`ma_hang_hong`),
  KEY `fk_hh_sp` (`ma_san_pham`),
  KEY `fk_hh_nv` (`ma_nv`),
  CONSTRAINT `fk_hh_nv` FOREIGN KEY (`ma_nv`) REFERENCES `nhan_vien` (`ma_nv`),
  CONSTRAINT `fk_hh_sp` FOREIGN KEY (`ma_san_pham`) REFERENCES `san_pham` (`ma_san_pham`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hang_hong`
--

LOCK TABLES `hang_hong` WRITE;
/*!40000 ALTER TABLE `hang_hong` DISABLE KEYS */;
/*!40000 ALTER TABLE `hang_hong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hoa_don_dat_san`
--

DROP TABLE IF EXISTS `hoa_don_dat_san`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hoa_don_dat_san` (
  `ma_hoa_don` int NOT NULL AUTO_INCREMENT,
  `ma_dat_san` int NOT NULL,
  `ngay_lap` date NOT NULL,
  `ma_nv_lap` int DEFAULT NULL,
  `ghi_chu` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ma_hoa_don`),
  UNIQUE KEY `ma_dat_san` (`ma_dat_san`),
  KEY `fk_hd_nv` (`ma_nv_lap`),
  CONSTRAINT `fk_hd_ds` FOREIGN KEY (`ma_dat_san`) REFERENCES `dat_san` (`ma_dat_san`),
  CONSTRAINT `fk_hd_nv` FOREIGN KEY (`ma_nv_lap`) REFERENCES `nhan_vien` (`ma_nv`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hoa_don_dat_san`
--

LOCK TABLES `hoa_don_dat_san` WRITE;
/*!40000 ALTER TABLE `hoa_don_dat_san` DISABLE KEYS */;
/*!40000 ALTER TABLE `hoa_don_dat_san` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hoa_don_dich_vu`
--

DROP TABLE IF EXISTS `hoa_don_dich_vu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hoa_don_dich_vu` (
  `ma_hd_dv` int NOT NULL AUTO_INCREMENT,
  `thoi_gian` datetime NOT NULL,
  `ma_nv` int DEFAULT NULL,
  `tong_tien` bigint NOT NULL,
  PRIMARY KEY (`ma_hd_dv`),
  KEY `fk_hddv_nv` (`ma_nv`),
  CONSTRAINT `fk_hddv_nv` FOREIGN KEY (`ma_nv`) REFERENCES `nhan_vien` (`ma_nv`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hoa_don_dich_vu`
--

LOCK TABLES `hoa_don_dich_vu` WRITE;
/*!40000 ALTER TABLE `hoa_don_dich_vu` DISABLE KEYS */;
/*!40000 ALTER TABLE `hoa_don_dich_vu` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `khach_hang`
--

DROP TABLE IF EXISTS `khach_hang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `khach_hang` (
  `ma_kh` int NOT NULL AUTO_INCREMENT,
  `ten_kh` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `so_dien_thoai` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ghi_chu` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ma_kh`),
  UNIQUE KEY `so_dien_thoai` (`so_dien_thoai`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `khach_hang`
--

LOCK TABLES `khach_hang` WRITE;
/*!40000 ALTER TABLE `khach_hang` DISABLE KEYS */;
INSERT INTO `khach_hang` VALUES (1,'FC Gò Vấp','0912000001',NULL),(2,'FC Bình Thạnh','0912000002','Hay đá tối'),(3,'Anh Tuấn - Q7','0912000003',NULL),(4,'Đội Công Ty ABC','0912000004','Đá thứ 6 hàng tuần'),(5,'Chị Lan - Phú Nhuận','0912000005',NULL),(6,'FC Tự Do Quận 3','0912000006','Đã từng boom sân'),(7,'Anh Hùng - Q10','0912000007',NULL),(8,'FC Thủ Đức United','0912000008',NULL);
/*!40000 ALTER TABLE `khach_hang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lich_su_doi_gio`
--

DROP TABLE IF EXISTS `lich_su_doi_gio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lich_su_doi_gio` (
  `ma_doi` int NOT NULL AUTO_INCREMENT,
  `ma_dat_san` int NOT NULL,
  `bat_dau_cu` time NOT NULL,
  `ket_thuc_cu` time NOT NULL,
  `bat_dau_moi` time NOT NULL,
  `ket_thuc_moi` time NOT NULL,
  `tien_san_cu` bigint NOT NULL,
  `tien_san_moi` bigint NOT NULL,
  `thoi_diem_doi` datetime NOT NULL,
  `ma_nv` int DEFAULT NULL,
  PRIMARY KEY (`ma_doi`),
  KEY `fk_ld_ds` (`ma_dat_san`),
  KEY `fk_ld_nv` (`ma_nv`),
  CONSTRAINT `fk_ld_ds` FOREIGN KEY (`ma_dat_san`) REFERENCES `dat_san` (`ma_dat_san`),
  CONSTRAINT `fk_ld_nv` FOREIGN KEY (`ma_nv`) REFERENCES `nhan_vien` (`ma_nv`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lich_su_doi_gio`
--

LOCK TABLES `lich_su_doi_gio` WRITE;
/*!40000 ALTER TABLE `lich_su_doi_gio` DISABLE KEYS */;
/*!40000 ALTER TABLE `lich_su_doi_gio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nha_cung_cap`
--

DROP TABLE IF EXISTS `nha_cung_cap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nha_cung_cap` (
  `ma_ncc` int NOT NULL AUTO_INCREMENT,
  `ten_ncc` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `so_dien_thoai` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dia_chi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nguoi_lien_he` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ghi_chu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ma_ncc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nha_cung_cap`
--

LOCK TABLES `nha_cung_cap` WRITE;
/*!40000 ALTER TABLE `nha_cung_cap` DISABLE KEYS */;
/*!40000 ALTER TABLE `nha_cung_cap` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nhan_vien`
--

DROP TABLE IF EXISTS `nhan_vien`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nhan_vien` (
  `ma_nv` int NOT NULL AUTO_INCREMENT,
  `ho_ten` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `so_dien_thoai` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ngay_sinh` date DEFAULT NULL,
  `dia_chi` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ngay_vao_lam` date DEFAULT NULL,
  `muc_luong_gio` bigint NOT NULL DEFAULT '50000',
  `trang_thai` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'dang_lam',
  PRIMARY KEY (`ma_nv`),
  CONSTRAINT `ck_nv_tt` CHECK ((`trang_thai` in (_utf8mb4'dang_lam',_utf8mb4'nghi_viec',_utf8mb4'tam_khoa')))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhan_vien`
--

LOCK TABLES `nhan_vien` WRITE;
/*!40000 ALTER TABLE `nhan_vien` DISABLE KEYS */;
INSERT INTO `nhan_vien` VALUES (1,'Trương Thịnh Phát','0901000001','1999-05-12','Quận 1, TP.HCM','2025-01-10',50000,'dang_lam'),(2,'Nguyễn Minh Khôi','0901000002','2001-08-20','Quận 3, TP.HCM','2025-06-01',50000,'dang_lam'),(3,'Lê Thu Hà','0901000003','2002-02-02','Quận 10, TP.HCM','2026-01-15',50000,'dang_lam');
/*!40000 ALTER TABLE `nhan_vien` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nhat_ky`
--

DROP TABLE IF EXISTS `nhat_ky`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nhat_ky` (
  `ma_nhat_ky` int NOT NULL AUTO_INCREMENT,
  `ma_nv` int DEFAULT NULL,
  `thao_tac` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `doi_tuong` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `noi_dung` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thoi_gian` datetime NOT NULL,
  PRIMARY KEY (`ma_nhat_ky`),
  KEY `fk_nk_nv` (`ma_nv`),
  KEY `idx_nk_tg` (`thoi_gian`),
  CONSTRAINT `fk_nk_nv` FOREIGN KEY (`ma_nv`) REFERENCES `nhan_vien` (`ma_nv`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhat_ky`
--

LOCK TABLES `nhat_ky` WRITE;
/*!40000 ALTER TABLE `nhat_ky` DISABLE KEYS */;
INSERT INTO `nhat_ky` VALUES (1,1,'SUA_BANG_GIA','Bảng giá #3','cuoi_tuan 07:00→17:00: 350.000đ ⇒ 350.000đ','2026-10-20 08:41:15');
/*!40000 ALTER TABLE `nhat_ky` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phieu_bao_tri`
--

DROP TABLE IF EXISTS `phieu_bao_tri`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phieu_bao_tri` (
  `ma_bao_tri` int NOT NULL AUTO_INCREMENT,
  `ma_thiet_bi` int NOT NULL,
  `so_luong` int NOT NULL,
  `ngay_bat_dau_sua` date NOT NULL,
  `noi_dung_sua_chua` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `chi_phi` bigint DEFAULT '0',
  `ngay_hoan_thanh` date DEFAULT NULL,
  `trang_thai` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'dang_sua',
  `ma_nv` int DEFAULT NULL,
  PRIMARY KEY (`ma_bao_tri`),
  KEY `fk_bt_tb` (`ma_thiet_bi`),
  KEY `fk_bt_nv` (`ma_nv`),
  CONSTRAINT `fk_bt_nv` FOREIGN KEY (`ma_nv`) REFERENCES `nhan_vien` (`ma_nv`),
  CONSTRAINT `fk_bt_tb` FOREIGN KEY (`ma_thiet_bi`) REFERENCES `thiet_bi` (`ma_thiet_bi`),
  CONSTRAINT `ck_bt_tt` CHECK ((`trang_thai` in (_utf8mb4'dang_sua',_utf8mb4'da_hoan_thanh')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phieu_bao_tri`
--

LOCK TABLES `phieu_bao_tri` WRITE;
/*!40000 ALTER TABLE `phieu_bao_tri` DISABLE KEYS */;
/*!40000 ALTER TABLE `phieu_bao_tri` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phieu_nhap`
--

DROP TABLE IF EXISTS `phieu_nhap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phieu_nhap` (
  `ma_phieu_nhap` int NOT NULL AUTO_INCREMENT,
  `ngay_nhap` date NOT NULL,
  `ma_nv` int DEFAULT NULL,
  `ma_ncc` int DEFAULT NULL,
  `trang_thai` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'nhap',
  `ghi_chu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ma_phieu_nhap`),
  KEY `fk_pn_nv` (`ma_nv`),
  KEY `fk_pn_ncc` (`ma_ncc`),
  CONSTRAINT `fk_pn_ncc` FOREIGN KEY (`ma_ncc`) REFERENCES `nha_cung_cap` (`ma_ncc`),
  CONSTRAINT `fk_pn_nv` FOREIGN KEY (`ma_nv`) REFERENCES `nhan_vien` (`ma_nv`),
  CONSTRAINT `ck_pn_tt` CHECK ((`trang_thai` in (_utf8mb4'nhap',_utf8mb4'cho_xac_nhan',_utf8mb4'da_xac_nhan',_utf8mb4'da_huy')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phieu_nhap`
--

LOCK TABLES `phieu_nhap` WRITE;
/*!40000 ALTER TABLE `phieu_nhap` DISABLE KEYS */;
/*!40000 ALTER TABLE `phieu_nhap` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `san_bong`
--

DROP TABLE IF EXISTS `san_bong`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `san_bong` (
  `ma_san` int NOT NULL,
  `trang_thai` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'hoat_dong',
  `ghi_chu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ma_san`),
  CONSTRAINT `ck_san_tt` CHECK ((`trang_thai` in (_utf8mb4'hoat_dong',_utf8mb4'ngung_hoat_dong')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `san_bong`
--

LOCK TABLES `san_bong` WRITE;
/*!40000 ALTER TABLE `san_bong` DISABLE KEYS */;
INSERT INTO `san_bong` VALUES (1,'hoat_dong',NULL),(2,'hoat_dong',NULL),(3,'hoat_dong',NULL),(4,'hoat_dong',NULL),(5,'hoat_dong',NULL),(6,'hoat_dong',NULL),(7,'hoat_dong',NULL),(8,'hoat_dong',NULL),(9,'hoat_dong',NULL),(10,'hoat_dong',NULL),(11,'hoat_dong',NULL),(12,'hoat_dong',NULL);
/*!40000 ALTER TABLE `san_bong` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `san_pham`
--

DROP TABLE IF EXISTS `san_pham`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `san_pham` (
  `ma_san_pham` int NOT NULL AUTO_INCREMENT,
  `ten_san_pham` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `loai_san_pham` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `don_vi_tinh` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'cái',
  `gia_ban` bigint NOT NULL,
  `so_luong_ton` int NOT NULL DEFAULT '0',
  `muc_ton_toi_thieu` int NOT NULL DEFAULT '5',
  `trang_thai_kinh_doanh` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'dang_ban',
  `ghi_chu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ma_san_pham`),
  CONSTRAINT `ck_sp_ton` CHECK ((`so_luong_ton` >= 0)),
  CONSTRAINT `ck_sp_tt` CHECK ((`trang_thai_kinh_doanh` in (_utf8mb4'dang_ban',_utf8mb4'ngung_ban',_utf8mb4'het_hang')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `san_pham`
--

LOCK TABLES `san_pham` WRITE;
/*!40000 ALTER TABLE `san_pham` DISABLE KEYS */;
/*!40000 ALTER TABLE `san_pham` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tai_khoan`
--

DROP TABLE IF EXISTS `tai_khoan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tai_khoan` (
  `ma_tk` int NOT NULL AUTO_INCREMENT,
  `ma_nv` int NOT NULL,
  `ten_dang_nhap` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mat_khau` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vai_tro` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'NHAN_VIEN',
  `trang_thai` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'hoat_dong',
  PRIMARY KEY (`ma_tk`),
  UNIQUE KEY `ma_nv` (`ma_nv`),
  UNIQUE KEY `ten_dang_nhap` (`ten_dang_nhap`),
  CONSTRAINT `fk_tk_nv` FOREIGN KEY (`ma_nv`) REFERENCES `nhan_vien` (`ma_nv`),
  CONSTRAINT `ck_tk_tt` CHECK ((`trang_thai` in (_utf8mb4'hoat_dong',_utf8mb4'tam_khoa'))),
  CONSTRAINT `ck_tk_vt` CHECK ((`vai_tro` in (_utf8mb4'QUAN_LY',_utf8mb4'NHAN_VIEN')))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tai_khoan`
--

LOCK TABLES `tai_khoan` WRITE;
/*!40000 ALTER TABLE `tai_khoan` DISABLE KEYS */;
INSERT INTO `tai_khoan` VALUES (1,1,'admin','$2a$10$qOgkXwEfQpSbCZf0/GH/H.jD0Wk5p4O7oTYCx0s9Bwk5xY10MebBm','QUAN_LY','hoat_dong'),(2,2,'nhanvien1','$2a$10$qOgkXwEfQpSbCZf0/GH/H.jD0Wk5p4O7oTYCx0s9Bwk5xY10MebBm','NHAN_VIEN','hoat_dong'),(3,3,'nhanvien2','$2a$10$zcngMRRq6Fa0ndvgAENwwu.vcZAQYpEnnw5NeGUeYdhT.cAJbW7.a','NHAN_VIEN','hoat_dong');
/*!40000 ALTER TABLE `tai_khoan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `them_gio`
--

DROP TABLE IF EXISTS `them_gio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `them_gio` (
  `ma_them_gio` int NOT NULL AUTO_INCREMENT,
  `ma_dat_san` int NOT NULL,
  `gio_ket_thuc_moi` time NOT NULL,
  `so_phut_them` int NOT NULL,
  `tien_them_gio` bigint NOT NULL,
  `thoi_diem_them` datetime NOT NULL,
  `ma_nv` int DEFAULT NULL,
  PRIMARY KEY (`ma_them_gio`),
  KEY `fk_tg_ds` (`ma_dat_san`),
  KEY `fk_tg_nv` (`ma_nv`),
  CONSTRAINT `fk_tg_ds` FOREIGN KEY (`ma_dat_san`) REFERENCES `dat_san` (`ma_dat_san`),
  CONSTRAINT `fk_tg_nv` FOREIGN KEY (`ma_nv`) REFERENCES `nhan_vien` (`ma_nv`),
  CONSTRAINT `ck_tg_phut` CHECK (((`so_phut_them` > 0) and ((`so_phut_them` % 30) = 0)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `them_gio`
--

LOCK TABLES `them_gio` WRITE;
/*!40000 ALTER TABLE `them_gio` DISABLE KEYS */;
/*!40000 ALTER TABLE `them_gio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `thiet_bi`
--

DROP TABLE IF EXISTS `thiet_bi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `thiet_bi` (
  `ma_thiet_bi` int NOT NULL AUTO_INCREMENT,
  `ten_thiet_bi` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `loai_thiet_bi` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `so_luong` int NOT NULL DEFAULT '0',
  `sl_dang_dung` int NOT NULL DEFAULT '0',
  `sl_trong_kho` int NOT NULL DEFAULT '0',
  `sl_hong` int NOT NULL DEFAULT '0',
  `sl_dang_sua` int NOT NULL DEFAULT '0',
  `sl_thanh_ly` int NOT NULL DEFAULT '0',
  `ngay_nhap` date DEFAULT NULL,
  `ghi_chu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ma_thiet_bi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `thiet_bi`
--

LOCK TABLES `thiet_bi` WRITE;
/*!40000 ALTER TABLE `thiet_bi` DISABLE KEYS */;
/*!40000 ALTER TABLE `thiet_bi` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-20  9:50:07
