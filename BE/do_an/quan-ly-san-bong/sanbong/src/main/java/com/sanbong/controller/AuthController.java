package com.sanbong.controller;

import com.sanbong.service.NhanSuService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequiredArgsConstructor
public class AuthController {
    private final NhanSuService nhanSu;

    @GetMapping("/login")
    public String login() { return "login"; }

    @GetMapping("/tai-khoan")
    public String taiKhoan() { return "tai-khoan"; }

    @PostMapping("/tai-khoan/doi-mat-khau")
    public String doiMatKhau(@RequestParam String matKhauCu, @RequestParam String matKhauMoi, RedirectAttributes ra) {
        nhanSu.doiMatKhau(matKhauCu, matKhauMoi);
        ra.addFlashAttribute("thongBao", "Đã đổi mật khẩu.");
        return "redirect:/tai-khoan";
    }
}
