package com.sanbong.controller;

import com.sanbong.dto.LichSanData;
import com.sanbong.service.LichSanService;
import com.sanbong.util.QuyDinh;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequiredArgsConstructor
public class LichSanController {
    private final LichSanService lichSanService;

    @GetMapping("/")
    public String root() { return "redirect:/lich-san"; }

    @GetMapping("/lich-san")
    public String lich(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngay, Model m) {
        if (ngay == null) ngay = LocalDate.now();
        LichSanData data = lichSanService.lichNgay(ngay);
        m.addAttribute("ngay", ngay);
        m.addAttribute("homNay", LocalDate.now());
        m.addAttribute("thu", QuyDinh.thu(ngay));
        m.addAttribute("data", data);
        m.addAttribute("gioList", QuyDinh.danhSachGio(QuyDinh.PHUT_MO_CUA, 23 * 60, 60));
        m.addAttribute("veUrl", "/lich-san?ngay=" + ngay);
        return "lich-san";
    }
}
