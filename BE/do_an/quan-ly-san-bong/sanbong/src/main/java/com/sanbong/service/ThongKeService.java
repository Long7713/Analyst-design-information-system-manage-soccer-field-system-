package com.sanbong.service;

import com.sanbong.dto.DongDoanhThu;
import com.sanbong.entity.*;
import com.sanbong.repository.*;
import com.sanbong.util.QuyDinh;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Doanh thu & thống kê. Doanh thu sân ghi nhận theo ngày đặt sân (ngay_dat). */
@Service
@RequiredArgsConstructor
public class ThongKeService {
    private final DatSanRepo datSanRepo;
    private final HoaDonDichVuRepo hoaDonDvRepo;
    private final HoaDonDatSanRepo hoaDonDatSanRepo;
    private final CaLamViecRepo caRepo;
    private final SanBongRepo sanRepo;
    private final SanPhamRepo sanPhamRepo;
    private final HangHongRepo hangHongRepo;
    private final PhieuNhapRepo phieuNhapRepo;

    private static final DateTimeFormatter NGAY = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    // ---------- DOANH THU ----------
    /** kieu: ngay | tuan | thang | nam */
    @Transactional(readOnly = true)
    public List<DongDoanhThu> doanhThu(LocalDate tu, LocalDate den, String kieu) {
        Map<String, long[]> map = new TreeMap<>();
        for (DatSan d : datSanRepo.findByNgayDatBetween(tu, den)) {
            long[] a = map.computeIfAbsent(khoa(d.getNgayDat(), kieu), k -> new long[3]);
            if (QuyDinh.DA_DA_XONG.equals(d.getTrangThai())) a[0] += d.getTongTien();
            else if (QuyDinh.DA_HUY.equals(d.getTrangThai()) || QuyDinh.KHACH_BOOM.equals(d.getTrangThai()))
                a[1] += QuyDinh.nz(d.getTienCocGiuLai());
        }
        for (HoaDonDichVu h : hoaDonDvRepo.findByThoiGianBetweenOrderByThoiGianDesc(tu.atStartOfDay(), den.plusDays(1).atStartOfDay())) {
            long[] a = map.computeIfAbsent(khoa(h.getThoiGian().toLocalDate(), kieu), k -> new long[3]);
            a[2] += QuyDinh.nz(h.getTongTien());
        }
        List<DongDoanhThu> kq = new ArrayList<>();
        for (Map.Entry<String, long[]> e : map.entrySet())
            kq.add(new DongDoanhThu(nhanKhoa(e.getKey(), kieu), e.getValue()[0], e.getValue()[1], e.getValue()[2]));
        return kq;
    }

    private String khoa(LocalDate d, String kieu) {
        switch (kieu) {
            case "tuan": return d.with(DayOfWeek.MONDAY).toString();
            case "thang": return d.toString().substring(0, 7);
            case "nam": return d.toString().substring(0, 4);
            default: return d.toString();
        }
    }

    private String nhanKhoa(String k, String kieu) {
        switch (kieu) {
            case "tuan": return "Tuần " + LocalDate.parse(k).format(DateTimeFormatter.ofPattern("dd/MM")) + " →";
            case "thang": return "Tháng " + k.substring(5) + "/" + k.substring(0, 4);
            case "nam": return "Năm " + k;
            default: return LocalDate.parse(k).format(DateTimeFormatter.ofPattern("dd/MM"));
        }
    }

    public DongDoanhThu tong(List<DongDoanhThu> ds, String nhan) {
        long a = 0, b = 0, c = 0;
        for (DongDoanhThu d : ds) { a += d.getSan(); b += d.getCocGiuLai(); c += d.getDichVu(); }
        return new DongDoanhThu(nhan, a, b, c);
    }

    // ---------- THỐNG KÊ SÂN ----------
    public static class SanThongKe {
        public SanBong san; public int luotDat, huy, boom; public double soGio; public long doanhThu; public double tyLe;
        public SanBong getSan() { return san; }
        public int getLuotDat() { return luotDat; }
        public int getHuy() { return huy; }
        public int getBoom() { return boom; }
        public double getSoGio() { return soGio; }
        public long getDoanhThu() { return doanhThu; }
        public double getTyLe() { return tyLe; }
    }

    @Transactional(readOnly = true)
    public List<SanThongKe> thongKeSan(LocalDate tu, LocalDate den) {
        Map<Integer, SanThongKe> map = new LinkedHashMap<>();
        for (SanBong s : sanRepo.findAllByOrderByMaSanAsc()) { SanThongKe t = new SanThongKe(); t.san = s; map.put(s.getMaSan(), t); }
        for (DatSan d : datSanRepo.findByNgayDatBetween(tu, den)) {
            SanThongKe t = map.get(d.getSanBong().getMaSan());
            if (t == null) continue;
            switch (d.getTrangThai()) {
                case QuyDinh.DA_DA_XONG:
                    t.luotDat++; t.soGio += d.getSoPhut() / 60.0; t.doanhThu += d.getTongTien(); break;
                case QuyDinh.DANG_DA: case QuyDinh.DA_XAC_NHAN: case QuyDinh.CHO_XAC_NHAN:
                    t.luotDat++; break;
                case QuyDinh.DA_HUY: t.huy++; t.doanhThu += QuyDinh.nz(d.getTienCocGiuLai()); break;
                case QuyDinh.KHACH_BOOM: t.boom++; t.doanhThu += QuyDinh.nz(d.getTienCocGiuLai()); break;
                default: break;
            }
        }
        long soNgay = Math.max(1, den.toEpochDay() - tu.toEpochDay() + 1);
        for (SanThongKe t : map.values()) t.tyLe = Math.round(t.soGio / (soNgay * 17.0) * 1000) / 10.0;
        return new ArrayList<>(map.values());
    }

    // ---------- THỐNG KÊ DỊCH VỤ ----------
    public static class SpBan {
        public String ten; public long soLuong; public long doanhThu;
        public String getTen() { return ten; }
        public long getSoLuong() { return soLuong; }
        public long getDoanhThu() { return doanhThu; }
    }

    @Transactional(readOnly = true)
    public List<SpBan> topDichVu(LocalDate tu, LocalDate den) {
        Map<Integer, SpBan> map = new LinkedHashMap<>();
        for (HoaDonDichVu h : hoaDonDvRepo.findByThoiGianBetweenOrderByThoiGianDesc(tu.atStartOfDay(), den.plusDays(1).atStartOfDay())) {
            for (ChiTietHoaDonDv c : h.getChiTiet()) {
                SpBan b = map.computeIfAbsent(c.getSanPham().getMaSanPham(), k -> {
                    SpBan x = new SpBan(); x.ten = c.getSanPham().getTenSanPham(); return x; });
                b.soLuong += c.getSoLuong();
                b.doanhThu += c.getThanhTien();
            }
        }
        List<SpBan> ds = new ArrayList<>(map.values());
        ds.sort((a, b) -> Long.compare(b.soLuong, a.soLuong));
        return ds;
    }

    // ---------- THỐNG KÊ NHÂN VIÊN ----------
    public static class NvThongKe {
        public NhanVien nv; public Set<LocalDate> ngay = new HashSet<>(); public double gio; public long luong; public int hoaDon, donXuLy;
        public NhanVien getNv() { return nv; }
        public int getSoNgay() { return ngay.size(); }
        public double getGio() { return gio; }
        public long getLuong() { return luong; }
        public int getHoaDon() { return hoaDon; }
        public int getDonXuLy() { return donXuLy; }
    }

    @Transactional(readOnly = true)
    public List<NvThongKe> thongKeNhanVien(LocalDate tu, LocalDate den) {
        Map<Integer, NvThongKe> map = new LinkedHashMap<>();
        for (CaLamViec c : caRepo.findByNgayLamBetweenOrderByNgayLamAscGioBatDauAsc(tu, den)) {
            NvThongKe t = map.computeIfAbsent(c.getNhanVien().getMaNv(), k -> { NvThongKe x = new NvThongKe(); x.nv = c.getNhanVien(); return x; });
            t.ngay.add(c.getNgayLam()); t.gio += c.getSoGio(); t.luong += c.getTienLuong();
        }
        for (HoaDonDatSan h : hoaDonDatSanRepo.findByNgayLapBetween(tu, den)) {
            if (h.getNvLap() == null) continue;
            NvThongKe t = map.computeIfAbsent(h.getNvLap().getMaNv(), k -> { NvThongKe x = new NvThongKe(); x.nv = h.getNvLap(); return x; });
            t.hoaDon++;
        }
        for (DatSan d : datSanRepo.findByNgayDatBetween(tu, den)) {
            if (d.getNvTao() == null) continue;
            NvThongKe t = map.computeIfAbsent(d.getNvTao().getMaNv(), k -> { NvThongKe x = new NvThongKe(); x.nv = d.getNvTao(); return x; });
            t.donXuLy++;
        }
        return new ArrayList<>(map.values());
    }

    // ---------- KHO DỊCH VỤ: tồn đầu + nhập - bán - hỏng = tồn cuối ----------
    public static class KhoDong {
        public SanPham sp; public long nhap, ban, hong;
        public SanPham getSp() { return sp; }
        public long getNhap() { return nhap; }
        public long getBan() { return ban; }
        public long getHong() { return hong; }
        public long getTonCuoi() { return sp.getSoLuongTon(); }
        public long getTonDau() { return getTonCuoi() - nhap + ban + hong; }
    }

    @Transactional(readOnly = true)
    public List<KhoDong> baoCaoKho(LocalDate tu, LocalDate den) {
        Map<Integer, KhoDong> map = new LinkedHashMap<>();
        for (SanPham s : sanPhamRepo.findAllByOrderByLoaiSanPhamAscTenSanPhamAsc()) { KhoDong k = new KhoDong(); k.sp = s; map.put(s.getMaSanPham(), k); }
        for (PhieuNhap p : phieuNhapRepo.findByNgayNhapBetweenAndTrangThai(tu, den, "da_xac_nhan"))
            for (ChiTietPhieuNhap c : p.getChiTiet())
                if (c.getSanPham() != null && map.containsKey(c.getSanPham().getMaSanPham())) map.get(c.getSanPham().getMaSanPham()).nhap += c.getSoLuong();
        for (HoaDonDichVu h : hoaDonDvRepo.findByThoiGianBetweenOrderByThoiGianDesc(tu.atStartOfDay(), den.plusDays(1).atStartOfDay()))
            for (ChiTietHoaDonDv c : h.getChiTiet())
                if (map.containsKey(c.getSanPham().getMaSanPham())) map.get(c.getSanPham().getMaSanPham()).ban += c.getSoLuong();
        for (HangHong h : hangHongRepo.findByThoiGianBetween(tu.atStartOfDay(), den.plusDays(1).atStartOfDay()))
            if (map.containsKey(h.getSanPham().getMaSanPham())) map.get(h.getSanPham().getMaSanPham()).hong += h.getSoLuong();
        return new ArrayList<>(map.values());
    }
}
