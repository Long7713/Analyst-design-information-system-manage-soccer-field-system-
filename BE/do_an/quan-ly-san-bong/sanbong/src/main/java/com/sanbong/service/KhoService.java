package com.sanbong.service;

import com.sanbong.entity.*;
import com.sanbong.repository.*;
import com.sanbong.util.NghiepVuException;
import com.sanbong.util.QuyDinh;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Sản phẩm dịch vụ, bán hàng (POS), thiết bị, bảo trì, nhập hàng. */
@Service
@RequiredArgsConstructor
public class KhoService {
    private final SanPhamRepo sanPhamRepo;
    private final HoaDonDichVuRepo hoaDonDvRepo;
    private final HangHongRepo hangHongRepo;
    private final ThietBiRepo thietBiRepo;
    private final ChiTietThietBiRepo chiTietTbRepo;
    private final PhieuBaoTriRepo baoTriRepo;
    private final PhieuNhapRepo phieuNhapRepo;
    private final NhaCungCapRepo nccRepo;
    private final SanBongRepo sanRepo;
    private final NguoiDungService nguoiDung;
    private final NhatKyService nhatKy;

    // ===================== SẢN PHẨM =====================
    @Transactional
    public SanPham luuSanPham(Integer id, String ten, String loai, String donVi, Long gia, Integer tonToiThieu, Integer ton, String ghiChu) {
        if (ten == null || ten.isBlank()) throw new NghiepVuException("Vui lòng nhập tên sản phẩm.");
        if (gia == null || gia < 0) throw new NghiepVuException("Giá bán không hợp lệ.");
        SanPham sp = id == null ? new SanPham() : sanPhamRepo.findById(id).orElseThrow(() -> new NghiepVuException("Không tìm thấy sản phẩm."));
        sp.setTenSanPham(ten.trim());
        sp.setLoaiSanPham(loai);
        sp.setDonViTinh(donVi == null || donVi.isBlank() ? "cái" : donVi);
        sp.setGiaBan(gia);
        sp.setMucTonToiThieu(tonToiThieu == null ? 5 : tonToiThieu);
        if (id == null) sp.setSoLuongTon(ton == null ? 0 : Math.max(ton, 0)); // tồn chỉ chỉnh qua nhập/bán/hỏng
        sp.setGhiChu(ghiChu);
        if (sp.getSoLuongTon() > 0 && "het_hang".equals(sp.getTrangThaiKinhDoanh())) sp.setTrangThaiKinhDoanh("dang_ban");
        if (sp.getSoLuongTon() <= 0 && "dang_ban".equals(sp.getTrangThaiKinhDoanh())) sp.setTrangThaiKinhDoanh("het_hang");
        sp = sanPhamRepo.save(sp);
        nhatKy.ghi(id == null ? "THEM_SAN_PHAM" : "SUA_SAN_PHAM", "SP #" + sp.getMaSanPham(), sp.getTenSanPham() + " - giá " + QuyDinh.tien(gia));
        return sp;
    }

    @Transactional
    public void doiTrangThaiSanPham(Integer id, boolean ngung) {
        SanPham sp = sanPhamRepo.findById(id).orElseThrow(() -> new NghiepVuException("Không tìm thấy sản phẩm."));
        sp.setTrangThaiKinhDoanh(ngung ? "ngung_ban" : (sp.getSoLuongTon() > 0 ? "dang_ban" : "het_hang"));
        nhatKy.ghi(ngung ? "NGUNG_KINH_DOANH" : "KINH_DOANH_LAI", "SP #" + id, sp.getTenSanPham());
    }

    @Transactional
    public void ghiHong(Integer id, int soLuong, String lyDo) {
        SanPham sp = sanPhamRepo.findById(id).orElseThrow(() -> new NghiepVuException("Không tìm thấy sản phẩm."));
        if (soLuong <= 0) throw new NghiepVuException("Số lượng hỏng phải lớn hơn 0.");
        if (soLuong > sp.getSoLuongTon()) throw new NghiepVuException("Số lượng hỏng vượt quá tồn kho (" + sp.getSoLuongTon() + ").");
        sp.setSoLuongTon(sp.getSoLuongTon() - soLuong);
        if (sp.getSoLuongTon() == 0 && "dang_ban".equals(sp.getTrangThaiKinhDoanh())) sp.setTrangThaiKinhDoanh("het_hang");
        HangHong h = new HangHong();
        h.setSanPham(sp); h.setSoLuong(soLuong); h.setLyDo(lyDo); h.setThoiGian(LocalDateTime.now()); h.setNhanVien(nguoiDung.hienTai());
        hangHongRepo.save(h);
        nhatKy.ghi("HANG_HONG", "SP #" + id, sp.getTenSanPham() + " hỏng " + soLuong + " - " + lyDo);
    }

    /** Bán dịch vụ: kiểm tra tồn, tính tiền, trừ kho, ghi giao dịch. Trả về danh sách cảnh báo (nếu có). */
    @Transactional
    public Object[] banHang(Map<Integer, Integer> soLuongTheoSp) {
        HoaDonDichVu hd = new HoaDonDichVu();
        hd.setThoiGian(LocalDateTime.now());
        hd.setNhanVien(nguoiDung.hienTai());
        long tong = 0;
        List<String> canhBao = new ArrayList<>();
        for (Map.Entry<Integer, Integer> e : soLuongTheoSp.entrySet()) {
            int sl = e.getValue();
            if (sl <= 0) continue;
            SanPham sp = sanPhamRepo.findById(e.getKey()).orElseThrow(() -> new NghiepVuException("Sản phẩm không tồn tại."));
            if ("ngung_ban".equals(sp.getTrangThaiKinhDoanh())) throw new NghiepVuException("\"" + sp.getTenSanPham() + "\" đã ngừng kinh doanh.");
            if (sp.getSoLuongTon() <= 0) throw new NghiepVuException("Sản phẩm \"" + sp.getTenSanPham() + "\" đã hết hàng.");
            if (sp.getSoLuongTon() < sl) throw new NghiepVuException("Số lượng sản phẩm \"" + sp.getTenSanPham() + "\" trong kho không đủ (còn " + sp.getSoLuongTon() + ").");
            sp.setSoLuongTon(sp.getSoLuongTon() - sl);
            if (sp.getSoLuongTon() == 0) sp.setTrangThaiKinhDoanh("het_hang");
            if (sp.getSoLuongTon() <= sp.getMucTonToiThieu()) canhBao.add("Sản phẩm \"" + sp.getTenSanPham() + "\" sắp hết hàng (còn " + sp.getSoLuongTon() + ").");
            ChiTietHoaDonDv ct = new ChiTietHoaDonDv();
            ct.setHoaDon(hd); ct.setSanPham(sp); ct.setSoLuong(sl); ct.setDonGia(sp.getGiaBan());
            hd.getChiTiet().add(ct);
            tong += ct.getThanhTien();
        }
        if (hd.getChiTiet().isEmpty()) throw new NghiepVuException("Vui lòng chọn ít nhất 1 sản phẩm.");
        hd.setTongTien(tong);
        hd = hoaDonDvRepo.save(hd);
        nhatKy.ghi("BAN_DICH_VU", "HĐ dịch vụ #" + hd.getMaHdDv(), hd.getChiTiet().size() + " mặt hàng, tổng " + QuyDinh.tien(tong));
        return new Object[]{tong, canhBao};
    }

    // ===================== THIẾT BỊ =====================
    @Transactional
    public ThietBi luuThietBi(Integer id, String ten, String loai, Integer dangDung, Integer trongKho, LocalDate ngayNhap, String ghiChu) {
        if (ten == null || ten.isBlank()) throw new NghiepVuException("Vui lòng nhập tên thiết bị.");
        ThietBi t = id == null ? new ThietBi() : thietBiRepo.findById(id).orElseThrow(() -> new NghiepVuException("Không tìm thấy thiết bị."));
        t.setTenThietBi(ten.trim());
        t.setLoaiThietBi(loai);
        t.setNgayNhap(ngayNhap);
        t.setGhiChu(ghiChu);
        if (id == null) {
            t.setSlDangDung(Math.max(dangDung == null ? 0 : dangDung, 0));
            t.setSlTrongKho(Math.max(trongKho == null ? 0 : trongKho, 0));
        }
        t.tinhLaiTong();
        t = thietBiRepo.save(t);
        nhatKy.ghi(id == null ? "THEM_THIET_BI" : "SUA_THIET_BI", "TB #" + t.getMaThietBi(), t.getTenThietBi());
        return t;
    }

    /** Chuyển số lượng giữa các tình trạng: dang_dung / trong_kho / hong / dang_sua / thanh_ly. */
    @Transactional
    public void chuyenTinhTrang(Integer id, String tu, String den, int sl, String lyDo) {
        ThietBi t = thietBiRepo.findById(id).orElseThrow(() -> new NghiepVuException("Không tìm thấy thiết bị."));
        if (sl <= 0) throw new NghiepVuException("Số lượng phải lớn hơn 0.");
        if (tu.equals(den)) throw new NghiepVuException("Tình trạng đi và đến phải khác nhau.");
        if (t.lay(tu) < sl) throw new NghiepVuException("Không đủ số lượng ở tình trạng nguồn (còn " + t.lay(tu) + ").");
        t.dat(tu, t.lay(tu) - sl);
        t.dat(den, t.lay(den) + sl);
        nhatKy.ghi("DOI_TINH_TRANG_TB", "TB #" + id, t.getTenThietBi() + ": " + sl + " từ " + tu + " → " + den + (lyDo == null ? "" : " (" + lyDo + ")"));
    }

    @Transactional
    public void taoBaoTri(Integer maTb, int sl, String noiDung, Long chiPhi) {
        ThietBi t = thietBiRepo.findById(maTb).orElseThrow(() -> new NghiepVuException("Không tìm thấy thiết bị."));
        if (sl <= 0 || sl > t.getSlHong()) throw new NghiepVuException("Số lượng sửa phải từ 1 đến số lượng đang hỏng (" + t.getSlHong() + ").");
        t.dat("hong", t.getSlHong() - sl);
        t.dat("dang_sua", t.getSlDangSua() + sl);
        PhieuBaoTri p = new PhieuBaoTri();
        p.setThietBi(t); p.setSoLuong(sl); p.setNgayBatDauSua(LocalDate.now());
        p.setNoiDungSuaChua(noiDung); p.setChiPhi(chiPhi == null ? 0 : chiPhi); p.setNhanVien(nguoiDung.hienTai());
        baoTriRepo.save(p);
        nhatKy.ghi("TAO_BAO_TRI", "TB #" + maTb, t.getTenThietBi() + " x" + sl + " - " + noiDung);
    }

    @Transactional
    public void hoanThanhBaoTri(Integer id, Long chiPhi) {
        PhieuBaoTri p = baoTriRepo.findById(id).orElseThrow(() -> new NghiepVuException("Không tìm thấy phiếu bảo trì."));
        if (!"dang_sua".equals(p.getTrangThai())) throw new NghiepVuException("Phiếu đã hoàn thành.");
        ThietBi t = p.getThietBi();
        t.dat("dang_sua", Math.max(t.getSlDangSua() - p.getSoLuong(), 0));
        t.dat("trong_kho", t.getSlTrongKho() + p.getSoLuong());
        p.setTrangThai("da_hoan_thanh");
        p.setNgayHoanThanh(LocalDate.now());
        if (chiPhi != null) p.setChiPhi(chiPhi);
        nhatKy.ghi("HOAN_THANH_BAO_TRI", "Phiếu #" + id, t.getTenThietBi() + " x" + p.getSoLuong() + ", chi phí " + QuyDinh.tien(QuyDinh.nz(p.getChiPhi())));
    }

    @Transactional
    public void luuChiTietThietBi(Integer maTb, String ten, Integer maSan, String tinhTrang, String ghiChu) {
        ThietBi t = thietBiRepo.findById(maTb).orElseThrow(() -> new NghiepVuException("Không tìm thấy thiết bị."));
        if (ten == null || ten.isBlank()) throw new NghiepVuException("Vui lòng nhập tên chi tiết (ví dụ: Khung thành sân 1).");
        ChiTietThietBi c = new ChiTietThietBi();
        c.setThietBi(t); c.setTenChiTiet(ten.trim());
        c.setSanBong(maSan == null ? null : sanRepo.findById(maSan).orElse(null));
        c.setTinhTrang(tinhTrang == null ? "dang_dung" : tinhTrang);
        c.setGhiChu(ghiChu);
        chiTietTbRepo.save(c);
    }

    @Transactional
    public void doiTinhTrangChiTiet(Integer id, String tinhTrang) {
        ChiTietThietBi c = chiTietTbRepo.findById(id).orElseThrow(() -> new NghiepVuException("Không tìm thấy chi tiết."));
        c.setTinhTrang(tinhTrang);
    }

    // ===================== NHÀ CUNG CẤP =====================
    @Transactional
    public void luuNcc(NhaCungCap n) {
        if (n.getTenNcc() == null || n.getTenNcc().isBlank()) throw new NghiepVuException("Vui lòng nhập tên nhà cung cấp.");
        nccRepo.save(n);
        nhatKy.ghi("LUU_NHA_CUNG_CAP", "NCC " + n.getTenNcc(), "");
    }

    // ===================== PHIẾU NHẬP =====================
    @Transactional
    public PhieuNhap taoPhieuNhap(Integer maNcc, LocalDate ngay, String ghiChu, List<String> loai, List<Integer> maHang,
                                  List<Integer> soLuong, List<Long> donGia, String hanhDong) {
        PhieuNhap p = new PhieuNhap();
        p.setNgayNhap(ngay == null ? LocalDate.now() : ngay);
        p.setNhanVien(nguoiDung.hienTai());
        p.setNhaCungCap(maNcc == null ? null : nccRepo.findById(maNcc).orElse(null));
        p.setGhiChu(ghiChu);
        p.setTrangThai("cho_xac_nhan".equals(hanhDong) ? "cho_xac_nhan" : "nhap");
        for (int i = 0; i < loai.size(); i++) {
            if (maHang.get(i) == null || soLuong.get(i) == null || soLuong.get(i) <= 0) continue;
            ChiTietPhieuNhap c = new ChiTietPhieuNhap();
            c.setPhieuNhap(p);
            if ("sp".equals(loai.get(i))) c.setSanPham(sanPhamRepo.findById(maHang.get(i)).orElseThrow(() -> new NghiepVuException("Sản phẩm không tồn tại.")));
            else c.setThietBi(thietBiRepo.findById(maHang.get(i)).orElseThrow(() -> new NghiepVuException("Thiết bị không tồn tại.")));
            c.setSoLuong(soLuong.get(i));
            c.setDonGia(donGia.get(i) == null ? 0 : donGia.get(i));
            p.getChiTiet().add(c);
        }
        if (p.getChiTiet().isEmpty()) throw new NghiepVuException("Phiếu nhập cần ít nhất 1 dòng hàng hợp lệ.");
        p = phieuNhapRepo.save(p);
        nhatKy.ghi("TAO_PHIEU_NHAP", "Phiếu nhập #" + p.getMaPhieuNhap(), "Tổng " + QuyDinh.tien(p.getTongTien()) + " (" + p.getNhanTrangThai() + ")");
        if ("xac_nhan".equals(hanhDong)) xacNhanPhieu(p.getMaPhieuNhap());
        return p;
    }

    @Transactional
    public void guiXacNhan(Integer id) {
        PhieuNhap p = phieuNhapRepo.findById(id).orElseThrow(() -> new NghiepVuException("Không tìm thấy phiếu nhập."));
        if (!"nhap".equals(p.getTrangThai())) throw new NghiepVuException("Chỉ gửi xác nhận phiếu nháp.");
        p.setTrangThai("cho_xac_nhan");
    }

    /** Chỉ khi xác nhận mới cộng số lượng vào kho. */
    @Transactional
    public void xacNhanPhieu(Integer id) {
        PhieuNhap p = phieuNhapRepo.findById(id).orElseThrow(() -> new NghiepVuException("Không tìm thấy phiếu nhập."));
        if ("da_xac_nhan".equals(p.getTrangThai()) || "da_huy".equals(p.getTrangThai()))
            throw new NghiepVuException("Phiếu nhập đã " + ("da_huy".equals(p.getTrangThai()) ? "hủy" : "xác nhận") + ".");
        for (ChiTietPhieuNhap c : p.getChiTiet()) {
            if (c.getSanPham() != null) {
                SanPham sp = c.getSanPham();
                sp.setSoLuongTon(sp.getSoLuongTon() + c.getSoLuong());
                if ("het_hang".equals(sp.getTrangThaiKinhDoanh())) sp.setTrangThaiKinhDoanh("dang_ban");
            } else {
                ThietBi t = c.getThietBi();
                t.dat("trong_kho", t.getSlTrongKho() + c.getSoLuong());
            }
        }
        p.setTrangThai("da_xac_nhan");
        nhatKy.ghi("XAC_NHAN_PHIEU_NHAP", "Phiếu nhập #" + id, "Đã cộng kho, tổng " + QuyDinh.tien(p.getTongTien()));
    }

    @Transactional
    public void huyPhieu(Integer id) {
        PhieuNhap p = phieuNhapRepo.findById(id).orElseThrow(() -> new NghiepVuException("Không tìm thấy phiếu nhập."));
        if ("da_xac_nhan".equals(p.getTrangThai())) throw new NghiepVuException("Phiếu đã xác nhận, không thể hủy.");
        p.setTrangThai("da_huy");
        nhatKy.ghi("HUY_PHIEU_NHAP", "Phiếu nhập #" + id, "");
    }
}
