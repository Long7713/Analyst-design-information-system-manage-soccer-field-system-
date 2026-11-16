package com.sanbong.controller;

import com.sanbong.dto.DatSanView;
import com.sanbong.dto.KhachThongKe;
import com.sanbong.entity.DatSan;
import com.sanbong.entity.KhachHang;
import com.sanbong.repository.DatSanRepo;
import com.sanbong.repository.KhachHangRepo;
import com.sanbong.service.DatSanService;
import com.sanbong.service.KhachHangService;
import com.sanbong.util.NghiepVuException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/khach-hang")
@RequiredArgsConstructor
public class KhachHangController {
    private final KhachHangService service;
    private final KhachHangRepo khachRepo;
    private final DatSanRepo datSanRepo;
    private final DatSanService datSanService;

    @GetMapping
    public String danhSach(@RequestParam(required = false) String q, Model m) {
        Map<Integer, KhachThongKe> all = service.thongKeTatCa(null, null);
        List<KhachThongKe> ds = new ArrayList<>();
        for (KhachThongKe t : all.values()) {
            if (q != null && !q.isBlank()) {
                String k = q.trim().toLowerCase();
                if (!t.getKhach().getTenKh().toLowerCase().contains(k) && !t.getKhach().getSoDienThoai().contains(k)) continue;
            }
            ds.add(t);
        }
        ds.sort(Comparator.comparing((KhachThongKe t) -> t.getNgayGanNhat() == null ? LocalDate.MIN : t.getNgayGanNhat()).reversed());

        LocalDate dauThang = LocalDate.now().withDayOfMonth(1);
        LocalDate cuoiThang = dauThang.plusMonths(1).minusDays(1);
        List<KhachThongKe> top = new ArrayList<>();
        for (KhachThongKe t : service.thongKeTatCa(dauThang, cuoiThang).values()) if (t.getSoLanDa() > 0) top.add(t);
        top.sort(Comparator.comparingInt(KhachThongKe::getSoLanDa).thenComparingLong(KhachThongKe::getTongChi).reversed());
        List<KhachThongKe> boom = new ArrayList<>();
        for (KhachThongKe t : all.values()) if (t.getSoLanBoom() > 0) boom.add(t);
        boom.sort(Comparator.comparingInt(KhachThongKe::getSoLanBoom).reversed());

        m.addAttribute("ds", ds);
        m.addAttribute("top", top.size() > 10 ? top.subList(0, 10) : top);
        m.addAttribute("boom", boom);
        m.addAttribute("q", q == null ? "" : q);
        m.addAttribute("thang", dauThang.getMonthValue() + "/" + dauThang.getYear());
        return "khach-hang";
    }

    @GetMapping("/{id}")
    public String chiTiet(@PathVariable Integer id, Model m) {
        KhachHang k = khachRepo.findById(id).orElseThrow(() -> new NghiepVuException("Không tìm thấy khách hàng."));
        LocalDateTime now = LocalDateTime.now();
        List<DatSanView> ls = new ArrayList<>();
        List<DatSan> ds = datSanRepo.findByKhachHang_MaKh(id);
        ds.sort(Comparator.comparing(DatSan::getNgayDat).thenComparing(DatSan::getGioBatDau).reversed());
        for (DatSan d : ds) ls.add(datSanService.toView(d, now));
        m.addAttribute("k", k);
        m.addAttribute("tk", service.thongKeTatCa(null, null).get(id));
        m.addAttribute("ls", ls);
        m.addAttribute("canhBao", datSanService.canhBaoBoom(k.getSoDienThoai()));
        return "khach-hang-chi-tiet";
    }

    @PostMapping("/luu")
    public String luu(@RequestParam(required = false) Integer maKh, @RequestParam String tenKh, @RequestParam String sdt,
                      @RequestParam(required = false) String ghiChu, RedirectAttributes ra) {
        service.luu(maKh, tenKh, sdt, ghiChu);
        ra.addFlashAttribute("thongBao", "Đã lưu khách hàng.");
        return "redirect:/khach-hang";
    }
}
