package com.sanbong.controller;

import com.sanbong.dto.DongDoanhThu;
import com.sanbong.service.ThongKeService;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequiredArgsConstructor
public class DoanhThuController {
    private final ThongKeService thongKe;

    @GetMapping("/doanh-thu")
    public String doanhThu(@RequestParam(defaultValue = "ngay") String kieu,
                           @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tu,
                           @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate den, Model m) {
        LocalDate hn = LocalDate.now();
        if (den == null) den = hn;
        if (tu == null) {
            switch (kieu) {
                case "tuan": tu = hn.minusWeeks(7); break;
                case "thang": tu = hn.minusMonths(5).withDayOfMonth(1); break;
                case "nam": tu = hn.minusYears(2).withDayOfYear(1); break;
                default: tu = hn.minusDays(13);
            }
        }
        if (den.isBefore(tu)) { LocalDate t = tu; tu = den; den = t; }
        List<DongDoanhThu> ds = thongKe.doanhThu(tu, den, kieu);
        List<String> nhan = new ArrayList<>();
        List<Long> san = new ArrayList<>(), coc = new ArrayList<>(), dv = new ArrayList<>(), tong = new ArrayList<>();
        for (DongDoanhThu d : ds) { nhan.add(d.getNhan()); san.add(d.getSan()); coc.add(d.getCocGiuLai()); dv.add(d.getDichVu()); tong.add(d.getTong()); }
        m.addAttribute("ds", ds);
        m.addAttribute("tong", thongKe.tong(ds, "Tổng"));
        m.addAttribute("kieu", kieu);
        m.addAttribute("tu", tu);
        m.addAttribute("den", den);
        m.addAttribute("cNhan", nhan);
        m.addAttribute("cSan", san);
        m.addAttribute("cCoc", coc);
        m.addAttribute("cDv", dv);
        m.addAttribute("cTong", tong);
        return "doanh-thu";
    }
}
