package com.sanbong.controller;

import com.sanbong.repository.NhatKyRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class NhatKyController {
    private final NhatKyRepo repo;

    @GetMapping("/nhat-ky")
    public String nhatKy(Model m) {
        m.addAttribute("ds", repo.findTop300ByOrderByThoiGianDesc());
        return "nhat-ky";
    }
}
