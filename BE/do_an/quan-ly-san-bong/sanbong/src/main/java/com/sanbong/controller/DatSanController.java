package com.sanbong.controller;

import com.sanbong.dto.DatSanView;
import com.sanbong.entity.DatSan;
import com.sanbong.entity.HoaDonDatSan;
import com.sanbong.repository.DatSanRepo;
import com.sanbong.repository.LichSuDoiGioRepo;
import com.sanbong.service.DatSanService;
import com.sanbong.util.QuyDinh;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/dat-san")
@RequiredArgsConstructor
public class DatSanController {
    private final DatSanService service;
    private final DatSanRepo datSanRepo;
    private final LichSuDoiGioRepo doiGioRepo;

    @GetMapping
    public String danhSach(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tu,
                           @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate den,
                           @RequestParam(required = false) String trangThai,
                           @RequestParam(required = false) String q, Model m) {
        if (tu == null) tu = LocalDate.now();
        if (den == null) den = tu;
        LocalDateTime now = LocalDateTime.now();
        List<DatSanView> ds = new ArrayList<>();
        for (DatSan d : datSanRepo.findByNgayDatBetween(tu, den)) {
            if (trangThai != null && !trangThai.isBlank() && !trangThai.equals(d.getTrangThai())) continue;
            if (q != null && !q.isBlank()) {
                String k = q.trim().toLowerCase();
                if (!d.getKhachHang().getTenKh().toLowerCase().contains(k) && !d.getKhachHang().getSoDienThoai().contains(k)
                        && !("sbl-" + d.getMaDatSan()).contains(k)) continue;
            }
            ds.add(service.toView(d, now));
        }
        ds.sort(Comparator.comparing(DatSanView::getNgay).thenComparing(DatSanView::getBatDau));
        m.addAttribute("ds", ds);
        m.addAttribute("tu", tu);
        m.addAttribute("den", den);
        m.addAttribute("trangThai", trangThai == null ? "" : trangThai);
        m.addAttribute("q", q == null ? "" : q);
        m.addAttribute("veUrl", "/dat-san?tu=" + tu + "&den=" + den);
        return "dat-san";
    }

    @GetMapping("/{id}")
    public String chiTiet(@PathVariable Integer id, Model m) {
        DatSan d = service.lay(id);
        m.addAttribute("d", service.toViewDayDu(d));
        m.addAttribute("dat", d);
        m.addAttribute("lichSuDoi", doiGioRepo.findByDatSan_MaDatSanOrderByThoiDiemDoiDesc(id));
        m.addAttribute("thoiLuong", QuyDinh.THOI_LUONG);
        m.addAttribute("canhBao", service.canhBaoBoom(d.getKhachHang().getSoDienThoai()));
        m.addAttribute("veUrl", "/dat-san/" + id);
        return "dat-san-chi-tiet";
    }

    @PostMapping("/tao")
    public String tao(@RequestParam Integer maSan,
                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngay,
                      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime batDau,
                      @RequestParam int soPhut, @RequestParam String tenKh, @RequestParam String sdt,
                      @RequestParam(required = false) Long tienCoc,
                      @RequestParam(defaultValue = "false") boolean daCoc,
                      @RequestParam(required = false) String ghiChu,
                      @RequestParam(required = false) String ve, RedirectAttributes ra) {
        String canhBao = service.canhBaoBoom(sdt); // cảnh báo khách từng boom (chỉ cảnh báo, không cấm)
        DatSan d = service.taoDon(maSan, ngay, batDau, soPhut, tenKh, sdt, tienCoc, daCoc, ghiChu);
        ra.addFlashAttribute("thongBao", "Đã tạo đơn đặt sân #" + d.getMaDatSan() + " (" + d.getSanBong().getTen() + ", "
                + d.getBatDauStr() + " → " + d.getKetThucStr() + ").");
        if (canhBao != null) ra.addFlashAttribute("canhBao", "⚠ " + canhBao);
        return Dieuhuong.ve(ve, "/lich-san?ngay=" + ngay);
    }

    @PostMapping("/{id}/xac-nhan-coc")
    public String xacNhanCoc(@PathVariable Integer id, @RequestParam(required = false) String ve, RedirectAttributes ra) {
        service.xacNhanCoc(id);
        ra.addFlashAttribute("thongBao", "Đã xác nhận nhận cọc.");
        return Dieuhuong.ve(ve, "/dat-san/" + id);
    }

    @PostMapping("/{id}/nhan-san")
    public String nhanSan(@PathVariable Integer id, @RequestParam(required = false) String ve, RedirectAttributes ra) {
        service.nhanSan(id);
        ra.addFlashAttribute("thongBao", "Khách đã nhận sân - trạng thái: Đang đá.");
        return Dieuhuong.ve(ve, "/dat-san/" + id);
    }

    @PostMapping("/{id}/ket-thuc")
    public String ketThuc(@PathVariable Integer id, @RequestParam(required = false) String ve, RedirectAttributes ra) {
        service.ketThuc(id);
        ra.addFlashAttribute("thongBao", "Đã kết thúc trận. Có thể in hóa đơn.");
        return Dieuhuong.ve(ve, "/dat-san/" + id);
    }

    @PostMapping("/{id}/huy")
    public String huy(@PathVariable Integer id, @RequestParam(required = false) String ve, RedirectAttributes ra) {
        ra.addFlashAttribute("thongBao", service.huy(id));
        return Dieuhuong.ve(ve, "/dat-san/" + id);
    }

    @PostMapping("/{id}/boom")
    public String boom(@PathVariable Integer id, @RequestParam(required = false) String ve, RedirectAttributes ra) {
        ra.addFlashAttribute("thongBao", service.boom(id));
        return Dieuhuong.ve(ve, "/dat-san/" + id);
    }

    @PostMapping("/{id}/doi-gio")
    public String doiGio(@PathVariable Integer id,
                         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime batDau,
                         @RequestParam int soPhut, RedirectAttributes ra) {
        service.doiGio(id, batDau, soPhut);
        ra.addFlashAttribute("thongBao", "Đã đổi thời gian đặt sân.");
        return "redirect:/dat-san/" + id;
    }

    @PostMapping("/{id}/them-gio")
    public String themGio(@PathVariable Integer id, @RequestParam int soPhut, RedirectAttributes ra) {
        service.themGio(id, soPhut);
        ra.addFlashAttribute("thongBao", "Đã thêm " + soPhut + " phút (" + QuyDinh.tien(soPhut / 30 * QuyDinh.TIEN_30_PHUT) + ").");
        return "redirect:/dat-san/" + id;
    }

    @PostMapping("/{id}/hoa-don")
    public String lapHoaDon(@PathVariable Integer id) {
        service.lapHoaDon(id);
        return "redirect:/dat-san/" + id + "/in-hoa-don";
    }

    @GetMapping("/{id}/in-hoa-don")
    public String inHoaDon(@PathVariable Integer id, Model m) {
        HoaDonDatSan h = service.lapHoaDon(id);
        m.addAttribute("hd", h);
        m.addAttribute("d", h.getDatSan());
        return "hoa-don";
    }
}
