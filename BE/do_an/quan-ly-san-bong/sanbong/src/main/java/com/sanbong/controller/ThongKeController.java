package com.sanbong.controller;

import com.sanbong.dto.KhachThongKe;
import com.sanbong.repository.KhachHangRepo;
import com.sanbong.repository.SanPhamRepo;
import com.sanbong.service.KhachHangService;
import com.sanbong.service.ThongKeService;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequiredArgsConstructor
public class ThongKeController {
    private final ThongKeService thongKe;
    private final KhachHangService khachService;
    private final SanPhamRepo sanPhamRepo;

    @GetMapping("/thong-ke")
    public String thongKe(@RequestParam(required = false) String thang, Model m) {
        YearMonth ym;
        try { ym = thang == null || thang.isBlank() ? YearMonth.now() : YearMonth.parse(thang); }
        catch (Exception e) { ym = YearMonth.now(); }
        LocalDate tu = ym.atDay(1), den = ym.atEndOfMonth();

        Map<Integer, KhachThongKe> kh = khachService.thongKeTatCa(tu, den);
        Map<Integer, KhachThongKe> khAll = khachService.thongKeTatCa(null, null);
        List<KhachThongKe> trongThang = new ArrayList<>();
        int moi = 0, quayLai = 0;
        for (KhachThongKe t : kh.values()) {
            if (t.getSoLanDat() == 0) continue;
            trongThang.add(t);
            // khách mới: toàn bộ lịch sử đặt sân nằm trong tháng này; quay lại: có đơn ngoài tháng này
            if (khAll.get(t.getKhach().getMaKh()).getSoLanDat() == t.getSoLanDat()) moi++; else quayLai++;
        }
        List<KhachThongKe> topDat = new ArrayList<>(trongThang), topChi = new ArrayList<>(trongThang),
                topBoom = new ArrayList<>(), topHuy = new ArrayList<>();
        topDat.sort(Comparator.comparingInt(KhachThongKe::getSoLanDat).reversed());
        topChi.sort(Comparator.comparingLong(KhachThongKe::getTongChi).reversed());
        for (KhachThongKe t : trongThang) { if (t.getSoLanBoom() > 0) topBoom.add(t); if (t.getSoLanHuy() > 0) topHuy.add(t); }
        topBoom.sort(Comparator.comparingInt(KhachThongKe::getSoLanBoom).reversed());
        topHuy.sort(Comparator.comparingInt(KhachThongKe::getSoLanHuy).reversed());
        double tongGio = 0;
        for (KhachThongKe t : trongThang) tongGio += t.getTongGio();

        m.addAttribute("thang", ym.toString());
        m.addAttribute("tu", tu);
        m.addAttribute("den", den);
        m.addAttribute("san", thongKe.thongKeSan(tu, den));
        m.addAttribute("dichVu", thongKe.topDichVu(tu, den));
        m.addAttribute("nhanVien", thongKe.thongKeNhanVien(tu, den));
        m.addAttribute("tongKhach", khAll.size());
        m.addAttribute("khachMoi", moi);
        m.addAttribute("khachQuayLai", quayLai);
        m.addAttribute("tongGio", tongGio);
        m.addAttribute("topDat", topDat.size() > 5 ? topDat.subList(0, 5) : topDat);
        m.addAttribute("topChi", topChi.size() > 5 ? topChi.subList(0, 5) : topChi);
        m.addAttribute("topBoom", topBoom);
        m.addAttribute("topHuy", topHuy);
        m.addAttribute("sapHet", sanPhamRepo.findAll().stream().filter(s -> s.isSapHet() && !"ngung_ban".equals(s.getTrangThaiKinhDoanh())).toList());
        m.addAttribute("hetHang", sanPhamRepo.findAll().stream().filter(s -> s.isHetHang() && !"ngung_ban".equals(s.getTrangThaiKinhDoanh())).toList());
        return "thong-ke";
    }
}
