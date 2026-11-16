package com.sanbong.controller;

import com.sanbong.repository.BangGiaRepo;
import com.sanbong.repository.SanBongRepo;
import com.sanbong.service.CaiDatService;
import com.sanbong.util.QuyDinh;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/cai-dat")
@RequiredArgsConstructor
public class CaiDatController {
    private final CaiDatService service;
    private final BangGiaRepo bangGiaRepo;
    private final SanBongRepo sanRepo;

    @GetMapping
    public String caiDat(Model m) {
        m.addAttribute("dsGia", bangGiaRepo.findAllByOrderByLoaiNgayAscGioBatDauAsc());
        m.addAttribute("dsSanCd", sanRepo.findAllByOrderByMaSanAsc());
        m.addAttribute("gioGia", QuyDinh.danhSachGio(QuyDinh.PHUT_MO_CUA, 24 * 60, 30));
        return "cai-dat";
    }

    @PostMapping("/bang-gia/luu")
    public String luuGia(@RequestParam(required = false) Integer maBangGia, @RequestParam String loaiNgay,
                         @RequestParam String gioBatDau, @RequestParam String gioKetThuc, @RequestParam Long giaMoiGio,
                         @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate apDungTu,
                         @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate apDungDen,
                         @RequestParam(defaultValue = "false") boolean kichHoat, RedirectAttributes ra) {
        service.luuBangGia(maBangGia, loaiNgay, gioBatDau, gioKetThuc, giaMoiGio, apDungTu, apDungDen, kichHoat);
        ra.addFlashAttribute("thongBao", "Đã lưu bảng giá. Đơn đặt mới sẽ tính theo giá này, đơn cũ giữ nguyên.");
        return "redirect:/cai-dat";
    }

    @PostMapping("/bang-gia/{id}/bat-tat")
    public String batTat(@PathVariable Integer id, RedirectAttributes ra) {
        service.batTatBangGia(id);
        ra.addFlashAttribute("thongBao", "Đã đổi trạng thái bảng giá.");
        return "redirect:/cai-dat";
    }

    @PostMapping("/san/{ma}/luu")
    public String luuSan(@PathVariable Integer ma, @RequestParam String trangThai, @RequestParam(required = false) String ghiChu,
                         RedirectAttributes ra) {
        service.capNhatSan(ma, trangThai, ghiChu);
        ra.addFlashAttribute("thongBao", "Đã cập nhật sân.");
        return "redirect:/cai-dat";
    }
}
