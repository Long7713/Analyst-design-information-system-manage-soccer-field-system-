package com.sanbong.service;

import com.sanbong.dto.DatSanView;
import com.sanbong.dto.KetQua;
import com.sanbong.entity.*;
import com.sanbong.repository.*;
import com.sanbong.util.NghiepVuException;
import com.sanbong.util.QuyDinh;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.sanbong.util.QuyDinh.*;

/** Toàn bộ nghiệp vụ đặt sân: kiểm tra trùng lịch, hủy, boom, đổi giờ, thêm giờ, hóa đơn. */
@Service
@RequiredArgsConstructor
public class DatSanService {
    private final DatSanRepo datSanRepo;
    private final KhachHangRepo khachRepo;
    private final SanBongRepo sanRepo;
    private final LichSuDoiGioRepo doiGioRepo;
    private final HoaDonDatSanRepo hoaDonRepo;
    private final GiaSanService giaSan;
    private final NguoiDungService nguoiDung;
    private final NhatKyService nhatKy;

    // ======================= TRA CỨU =======================
    public DatSan lay(Integer id) {
        return datSanRepo.findById(id).orElseThrow(() -> new NghiepVuException("Không tìm thấy đơn đặt sân #" + id));
    }

    public List<DatSan> dangChiem(Integer maSan, LocalDate ngay, Integer boQua) {
        return datSanRepo.findBySanBong_MaSanAndNgayDat(maSan, ngay).stream()
                .filter(DatSan::isDangChiemSan)
                .filter(d -> boQua == null || !d.getMaDatSan().equals(boQua))
                .toList();
    }

    /** Số phút còn trống liên tiếp tính từ phút "tuPhut" (đến đơn kế tiếp hoặc 24:00). */
    public int phutTrongToiDa(Integer maSan, LocalDate ngay, int tuPhut, Integer boQua) {
        int toiDa = PHUT_DONG_CUA - tuPhut;
        for (DatSan d : dangChiem(maSan, ngay, boQua)) {
            int bd = phutBatDau(d.getGioBatDau());
            int kt = phutKetThuc(d.getGioKetThuc());
            if (bd < tuPhut && kt > tuPhut) return 0;       // đang bị chiếm
            if (bd >= tuPhut) toiDa = Math.min(toiDa, bd - tuPhut);
        }
        return Math.max(toiDa, 0);
    }

    public String canhBaoBoom(String sdt) {
        return khachRepo.findBySoDienThoai(chuanHoaSdt(sdt)).map(k -> {
            long n = datSanRepo.countByKhachHang_MaKhAndTrangThai(k.getMaKh(), KHACH_BOOM);
            return n > 0 ? k.getTenKh() + " - " + k.getSoDienThoai() + ": đã boom sân " + n + " lần." : null;
        }).orElse(null);
    }

    // ======================= ĐẶT SÂN =======================
    /** Kiểm tra khung giờ có đặt được không (dùng cho cả đặt mới & đổi giờ). */
    public KetQua kiemTraDat(Integer maSan, LocalDate ngay, LocalTime batDau, int soPhut, Integer boQua) {
        if (maSan == null || ngay == null || batDau == null) return KetQua.loi("Vui lòng chọn đủ sân, ngày và giờ.");
        SanBong san = sanRepo.findById(maSan).orElse(null);
        if (san == null || !"hoat_dong".equals(san.getTrangThai()))
            return KetQua.loi("Sân không tồn tại hoặc đang ngừng hoạt động.");
        boolean hopLe = false;
        for (int t : THOI_LUONG) if (t == soPhut) hopLe = true;
        if (!hopLe) return KetQua.loi("Chỉ được đặt 1 giờ, 1,5 giờ hoặc 2 giờ.");
        int bd = phutBatDau(batDau);
        int kt = bd + soPhut;
        if (bd % 30 != 0) return KetQua.loi("Giờ bắt đầu phải tròn giờ hoặc 30 phút.");
        if (bd < PHUT_MO_CUA || kt > PHUT_DONG_CUA)
            return KetQua.loi("Sân chỉ hoạt động từ 07:00 đến 24:00.");
        LocalDateTime now = LocalDateTime.now();
        if (ngay.isBefore(now.toLocalDate())) return KetQua.loi("Không thể đặt sân cho ngày đã qua.");
        LocalDateTime ketThuc = kt >= 1440 ? ngay.plusDays(1).atStartOfDay() : ngay.atTime(kt / 60, kt % 60);
        if (!ketThuc.isAfter(now)) return KetQua.loi("Khung giờ này đã qua.");
        for (DatSan d : dangChiem(maSan, ngay, boQua)) {
            int b = phutBatDau(d.getGioBatDau());
            int k = phutKetThuc(d.getGioKetThuc());
            if (bd < k && kt > b)  // kiểm tra TOÀN BỘ khoảng thời gian, không chỉ giờ bắt đầu
                return KetQua.loi("Sân đã được đặt trong khung giờ này");
        }
        long tien;
        try { tien = giaSan.tinhTien(ngay, bd, kt); }
        catch (NghiepVuException e) { return KetQua.loi(e.getMessage()); }
        long coc = Math.round(tien * TY_LE_COC / 100.0);
        return new KetQua(true, "Sân trống", tien, coc, 0);
    }

    @Transactional
    public DatSan taoDon(Integer maSan, LocalDate ngay, LocalTime batDau, int soPhut,
                         String tenKh, String sdt, Long tienCoc, boolean daCoc, String ghiChu) {
        String so = chuanHoaSdt(sdt);
        if (!so.matches("\\d{8,12}")) throw new NghiepVuException("Số điện thoại không hợp lệ.");
        if (tenKh == null || tenKh.isBlank()) throw new NghiepVuException("Vui lòng nhập tên khách hàng.");
        KetQua kq = kiemTraDat(maSan, ngay, batDau, soPhut, null);
        if (!kq.ok()) throw new NghiepVuException(kq.message());

        final String ten = tenKh.trim();
        KhachHang kh = khachRepo.findBySoDienThoai(so).orElseGet(() -> {
            KhachHang k = new KhachHang();
            k.setTenKh(ten);
            k.setSoDienThoai(so);
            return khachRepo.save(k);
        });
        long coc = tienCoc == null ? kq.tienCoc() : tienCoc;
        if (coc < 0 || coc > kq.tienSan()) throw new NghiepVuException("Tiền cọc không hợp lệ (0 → " + tien(kq.tienSan()) + ").");

        DatSan d = new DatSan();
        d.setKhachHang(kh);
        d.setSanBong(sanRepo.getReferenceById(maSan));
        d.setNgayDat(ngay);
        d.setGioBatDau(batDau);
        d.setGioKetThuc(gioTuPhut(phutBatDau(batDau) + soPhut));
        d.setTienSan(kq.tienSan());
        d.setTienCoc(coc);
        d.setTrangThai(daCoc ? DA_XAC_NHAN : CHO_XAC_NHAN);
        d.setNvTao(nguoiDung.hienTai());
        d.setGhiChu(ghiChu);
        d.setThoiGianTao(LocalDateTime.now());
        d = datSanRepo.save(d);
        nhatKy.ghi("TAO_DON_DAT_SAN", "Đơn #" + d.getMaDatSan(),
                String.format("%s - %s, %s %s→%s, tiền sân %s, cọc %s", kh.getTenKh(), d.getSanBong() == null ? "" : "Sân " + maSan,
                        ngay, d.getBatDauStr(), d.getKetThucStr(), tien(kq.tienSan()), tien(coc)));
        return d;
    }

    @Transactional
    public void xacNhanCoc(Integer id) {
        DatSan d = lay(id);
        if (!CHO_XAC_NHAN.equals(d.getTrangThai())) throw new NghiepVuException("Đơn không ở trạng thái chờ cọc.");
        d.setTrangThai(DA_XAC_NHAN);
        nhatKy.ghi("XAC_NHAN_COC", "Đơn #" + id, "Xác nhận đã nhận cọc " + tien(nz(d.getTienCoc())));
    }

    @Transactional
    public void nhanSan(Integer id) {
        DatSan d = lay(id);
        if (!DA_XAC_NHAN.equals(d.getTrangThai())) throw new NghiepVuException("Chỉ nhận sân cho đơn đã cọc.");
        d.setTrangThai(DANG_DA);
        nhatKy.ghi("NHAN_SAN", "Đơn #" + id, "Khách nhận sân, bắt đầu đá");
    }

    @Transactional
    public void ketThuc(Integer id) {
        DatSan d = lay(id);
        if (!DANG_DA.equals(d.getTrangThai())) throw new NghiepVuException("Đơn chưa ở trạng thái đang đá.");
        d.setTrangThai(DA_DA_XONG);
        nhatKy.ghi("KET_THUC_TRAN", "Đơn #" + id, "Kết thúc trận, tổng tiền " + tien(d.getTongTien()));
    }

    // ======================= HỦY / BOOM =======================
    @Transactional
    public String huy(Integer id) {
        DatSan d = lay(id);
        if (!CHO_XAC_NHAN.equals(d.getTrangThai()) && !DA_XAC_NHAN.equals(d.getTrangThai()))
            throw new NghiepVuException("Đơn này không thể hủy.");
        LocalDateTime now = LocalDateTime.now();
        boolean som = !now.isAfter(d.getBatDauDt().minusHours(GIO_HUY_SOM));
        long coc = nz(d.getTienCoc());
        long giu = som ? Math.round(coc * TY_LE_GIU_COC_HUY_SOM / 100.0) : coc;
        d.setTrangThai(DA_HUY);
        d.setThoiGianHuy(now);
        d.setNvHuy(nguoiDung.hienTai());
        d.setTienCocGiuLai(giu);
        String kq = som
                ? "Hủy sớm (trước giờ đá ≥ 3 tiếng): giữ " + tien(giu) + " vào doanh thu, hoàn khách " + tien(coc - giu) + "."
                : "Hủy trễ (dưới 3 tiếng): không hoàn cọc, " + tien(giu) + " tính vào doanh thu.";
        nhatKy.ghi("HUY_SAN", "Đơn #" + id, kq);
        return "Đã hủy sân. " + kq;
    }

    @Transactional
    public String boom(Integer id) {
        DatSan d = lay(id);
        LocalDateTime now = LocalDateTime.now();
        if (!CHO_XAC_NHAN.equals(d.getTrangThai()) && !DA_XAC_NHAN.equals(d.getTrangThai()))
            throw new NghiepVuException("Đơn này không thể báo boom.");
        if (now.isBefore(d.getBatDauDt().plusMinutes(PHUT_BOOM)))
            throw new NghiepVuException("Chỉ xác nhận boom sau giờ bắt đầu " + PHUT_BOOM + " phút mà khách chưa đến (từ "
                    + d.getBatDauDt().plusMinutes(PHUT_BOOM).toLocalTime().toString() + ").");
        d.setTrangThai(KHACH_BOOM);
        d.setThoiGianBoom(now);
        d.setNvBoom(nguoiDung.hienTai());
        d.setTienCocGiuLai(nz(d.getTienCoc()));
        long n = datSanRepo.countByKhachHang_MaKhAndTrangThai(d.getKhachHang().getMaKh(), KHACH_BOOM);
        nhatKy.ghi("KHACH_BOOM", "Đơn #" + id, d.getKhachHang().getTenKh() + " boom sân (lần " + n + "), giữ cọc " + tien(nz(d.getTienCoc())));
        return "Đã ghi nhận khách boom (lần thứ " + n + "). Giữ cọc " + tien(nz(d.getTienCoc())) + ", sân đã được mở lại.";
    }

    // ======================= ĐỔI GIỜ =======================
    public KetQua kiemTraDoiGio(Integer id, LocalTime batDau, int soPhut) {
        DatSan d = lay(id);
        if (!CHO_XAC_NHAN.equals(d.getTrangThai()) && !DA_XAC_NHAN.equals(d.getTrangThai()))
            return KetQua.loi("Đơn này không thể đổi thời gian.");
        if (LocalDateTime.now().isAfter(d.getBatDauDt().minusHours(GIO_HUY_SOM)))
            return KetQua.loi("Chỉ được đổi thời gian khi còn từ 3 tiếng trở lên trước giờ bắt đầu.");
        return kiemTraDat(d.getSanBong().getMaSan(), d.getNgayDat(), batDau, soPhut, id);
    }

    @Transactional
    public void doiGio(Integer id, LocalTime batDau, int soPhut) {
        KetQua kq = kiemTraDoiGio(id, batDau, soPhut);
        if (!kq.ok()) throw new NghiepVuException(kq.message());
        DatSan d = lay(id);
        LichSuDoiGio ls = new LichSuDoiGio();
        ls.setDatSan(d);
        ls.setBatDauCu(d.getGioBatDau());
        ls.setKetThucCu(d.getGioKetThuc());
        ls.setTienSanCu(d.getTienSan());
        d.setGioBatDau(batDau);
        d.setGioKetThuc(gioTuPhut(phutBatDau(batDau) + soPhut));
        d.setTienSan(kq.tienSan());
        ls.setBatDauMoi(d.getGioBatDau());
        ls.setKetThucMoi(d.getGioKetThuc());
        ls.setTienSanMoi(kq.tienSan());
        ls.setThoiDiemDoi(LocalDateTime.now());
        ls.setNhanVien(nguoiDung.hienTai());
        doiGioRepo.save(ls);
        nhatKy.ghi("DOI_THOI_GIAN", "Đơn #" + id, ls.getCuStr() + "  ⇒  " + ls.getMoiStr());
    }

    // ======================= THÊM GIỜ =======================
    public KetQua kiemTraThemGio(Integer id, int soPhut) {
        DatSan d = lay(id);
        if (!DANG_DA.equals(d.getTrangThai())) return KetQua.loi("Chỉ thêm giờ khi khách đang đá.");
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime tuLuc = d.getKetThucDt().minusMinutes(PHUT_THEM_GIO_TOI_DA);
        if (now.isBefore(tuLuc))
            return KetQua.loi("Chỉ được thêm giờ khi còn tối đa " + PHUT_THEM_GIO_TOI_DA + " phút trước giờ kết thúc (từ "
                    + tuLuc.toLocalTime() + ").");
        if (soPhut <= 0 || soPhut % 30 != 0) return KetQua.loi("Số phút thêm phải chia hết cho 30.");
        int kt = phutKetThuc(d.getGioKetThuc());
        int trong = kt >= 1440 ? 0 : phutTrongToiDa(d.getSanBong().getMaSan(), d.getNgayDat(), kt, id);
        int toiDa = trong / 30 * 30;
        if (soPhut > toiDa) {
            String msg = toiDa >= 30
                    ? String.format("Vào lúc %s hết sân, không thể thêm đủ %d phút. Chỉ có thể thêm tối đa %d phút từ %s → %s.",
                        gioStr(kt + trong), soPhut, toiDa, gioStr(kt), gioStr(kt + toiDa))
                    : String.format("Vào lúc %s hết sân, không thể thêm giờ.", gioStr(kt + trong));
            return new KetQua(false, msg, 0, 0, toiDa);
        }
        return new KetQua(true, "Hợp lệ", soPhut / 30 * TIEN_30_PHUT, 0, toiDa);
    }

    @Transactional
    public void themGio(Integer id, int soPhut) {
        KetQua kq = kiemTraThemGio(id, soPhut);
        if (!kq.ok()) throw new NghiepVuException(kq.message());
        DatSan d = lay(id);
        ThemGio t = new ThemGio();
        t.setDatSan(d);
        d.setGioKetThuc(gioTuPhut(phutKetThuc(d.getGioKetThuc()) + soPhut));
        t.setGioKetThucMoi(d.getGioKetThuc());
        t.setSoPhutThem(soPhut);
        t.setTienThemGio(kq.tienSan());
        t.setThoiDiemThem(LocalDateTime.now());
        t.setNhanVien(nguoiDung.hienTai());
        d.getDsThemGio().add(t);
        datSanRepo.save(d);
        nhatKy.ghi("THEM_GIO", "Đơn #" + id, "Thêm " + soPhut + " phút (" + tien(kq.tienSan()) + "), kết thúc mới " + d.getKetThucStr());
    }

    // ======================= HÓA ĐƠN =======================
    @Transactional
    public HoaDonDatSan lapHoaDon(Integer id) {
        DatSan d = lay(id);
        if (!DA_DA_XONG.equals(d.getTrangThai()))
            throw new NghiepVuException("Chỉ in hóa đơn sau khi khách đá xong và thanh toán đủ.");
        return hoaDonRepo.findByDatSan_MaDatSan(id).orElseGet(() -> {
            HoaDonDatSan h = new HoaDonDatSan();
            h.setDatSan(d);
            h.setNgayLap(LocalDate.now());
            h.setNvLap(nguoiDung.hienTai());
            h.setGhiChu("Nếu quý khách sử dụng thêm giờ, mỗi 30 phút được tính 50.000 VNĐ.");
            HoaDonDatSan saved = hoaDonRepo.save(h);
            nhatKy.ghi("TAO_HOA_DON", "Hóa đơn #" + saved.getMaHoaDon(), "Đơn #" + id + ", tổng " + tien(d.getTongTien()));
            return saved;
        });
    }

    // ======================= HIỂN THỊ =======================
    public DatSanView toView(DatSan d, LocalDateTime now) {
        DatSanView v = new DatSanView();
        v.setMaDatSan(d.getMaDatSan());
        v.setMaSan(d.getSanBong().getMaSan());
        v.setTenSan(d.getSanBong().getTen());
        v.setTenKh(d.getKhachHang().getTenKh());
        v.setSdt(d.getKhachHang().getSoDienThoai());
        v.setNgay(d.getNgayDat().toString());
        v.setBatDau(d.getBatDauStr());
        v.setKetThuc(d.getKetThucStr());
        v.setSoGio(d.getSoGioStr());
        v.setTrangThai(d.getTrangThai());
        v.setNhan(nhan(d.getTrangThai()));
        v.setTienSan(nz(d.getTienSan()));
        v.setTienThemGio(d.getTongTienThemGio());
        v.setTongTien(d.getTongTien());
        v.setTienCoc(nz(d.getTienCoc()));
        v.setTienThu(d.getTienThuTaiSan());
        v.setTienGiuLai(nz(d.getTienCocGiuLai()));
        v.setTenNvTao(d.getNvTao() == null ? "" : d.getNvTao().getHoTen());
        v.setGhiChu(d.getGhiChu());

        String tt = d.getTrangThai();
        boolean choDa = CHO_XAC_NHAN.equals(tt) || DA_XAC_NHAN.equals(tt);
        LocalDateTime bd = d.getBatDauDt();
        LocalDateTime kt = d.getKetThucDt();
        v.setCanHuy(choDa);
        v.setCanXacNhanCoc(CHO_XAC_NHAN.equals(tt));
        v.setCanNhanSan(DA_XAC_NHAN.equals(tt));
        v.setCanBoom(choDa && !now.isBefore(bd.plusMinutes(PHUT_BOOM)));
        v.setQuaGio(v.isCanBoom());
        v.setCanDoiGio(choDa && !now.isAfter(bd.minusHours(GIO_HUY_SOM)));
        v.setCanKetThuc(DANG_DA.equals(tt));
        v.setCanThemGio(DANG_DA.equals(tt) && !now.isBefore(kt.minusMinutes(PHUT_THEM_GIO_TOI_DA)));
        v.setCanHoaDon(DA_DA_XONG.equals(tt));

        String css;
        if (DA_HUY.equals(tt)) css = "do";
        else if (KHACH_BOOM.equals(tt)) css = "boom";
        else if (DA_DA_XONG.equals(tt)) css = "xong";
        else if (DANG_DA.equals(tt)) css = "xanh";
        else if (v.isQuaGio()) css = "quagio";
        else if (!now.isBefore(bd.minusMinutes(PHUT_GIO_VANG))) css = "vang";
        else if (CHO_XAC_NHAN.equals(tt)) css = "choc";
        else css = "trang";
        v.setCss(css);

        double tong = PHUT_DONG_CUA - PHUT_MO_CUA;
        int b = Math.max(phutBatDau(d.getGioBatDau()), PHUT_MO_CUA);
        int k = Math.min(phutKetThuc(d.getGioKetThuc()), PHUT_DONG_CUA);
        v.setLeft(Math.round((b - PHUT_MO_CUA) / tong * 100000) / 1000.0);
        v.setWidth(Math.round((k - b) / tong * 100000) / 1000.0);
        return v;
    }

    public DatSanView toViewDayDu(DatSan d) {
        DatSanView v = toView(d, LocalDateTime.now());
        v.setSoLanBoom(datSanRepo.countByKhachHang_MaKhAndTrangThai(d.getKhachHang().getMaKh(), KHACH_BOOM));
        v.setDaCoHoaDon(hoaDonRepo.findByDatSan_MaDatSan(d.getMaDatSan()).isPresent());
        return v;
    }
}
