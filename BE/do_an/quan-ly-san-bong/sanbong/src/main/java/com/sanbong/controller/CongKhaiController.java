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

/** Lịch công khai (không cần đăng nhập, không hiện thông tin khách). */
@Controller
@RequiredArgsConstructor
public class CongKhaiController {
    private final LichSanService lichSan;

    @GetMapping("/cong-khai")
    public String congKhai(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngay, Model m) {
        if (ngay == null) ngay = LocalDate.now();
        LichSanData data = lichSan.lichNgay(ngay);
        m.addAttribute("ngay", ngay);
        m.addAttribute("thu", QuyDinh.thu(ngay));
        m.addAttribute("data", data);
        return "cong-khai";
    }
}
