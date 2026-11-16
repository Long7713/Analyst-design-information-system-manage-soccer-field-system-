package com.sanbong.controller;

import com.sanbong.entity.HoaDonDichVu;
import com.sanbong.entity.SanPham;
import com.sanbong.repository.HoaDonDichVuRepo;
import com.sanbong.repository.SanPhamRepo;
import com.sanbong.service.KhoService;
import com.sanbong.util.NghiepVuException;
import com.sanbong.util.QuyDinh;
import java.time.LocalDate;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/dich-vu")
@RequiredArgsConstructor
public class DichVuController {
    private final KhoService khoService;
    private final SanPhamRepo sanPhamRepo;
    private final HoaDonDichVuRepo hoaDonRepo;

    /** Màn hình bán hàng (POS). */
    @GetMapping
    public String pos(Model m) {
        List<HoaDonDichVu> homNay = hoaDonRepo.findByThoiGianBetweenOrderByThoiGianDesc(
                LocalDate.now().atStartOfDay(), LocalDate.now().plusDays(1).atStartOfDay());
        long tong = 0;
        for (HoaDonDichVu h : homNay) tong += QuyDinh.nz(h.getTongTien());
        m.addAttribute("dsSp", sanPhamRepo.findByTrangThaiKinhDoanhNotOrderByLoaiSanPhamAscTenSanPhamAsc("ngung_ban"));
        m.addAttribute("homNay", homNay);
        m.addAttribute("tongHomNay", tong);
        return "dich-vu";
    }

    @SuppressWarnings("unchecked")
    @PostMapping("/thanh-toan")
    public String thanhToan(@RequestParam Map<String, String> params, RedirectAttributes ra) {
        Map<Integer, Integer> sl = new LinkedHashMap<>();
        for (Map.Entry<String, String> e : params.entrySet()) {
            if (!e.getKey().startsWith("sl_") || e.getValue() == null || e.getValue().isBlank()) continue;
            try {
                int n = Integer.parseInt(e.getValue().trim());
                if (n > 0) sl.put(Integer.parseInt(e.getKey().substring(3)), n);
            } catch (NumberFormatException ex) {
                throw new NghiepVuException("Số lượng không hợp lệ.");
            }
        }
        Object[] kq = khoService.banHang(sl);
        ra.addFlashAttribute("thongBao", "Thanh toán thành công: " + QuyDinh.tien((Long) kq[0]));
        List<String> cb = (List<String>) kq[1];
        if (!cb.isEmpty()) ra.addFlashAttribute("canhBao", "⚠ " + String.join(" ", cb));
        return "redirect:/dich-vu";
    }

    // ---------- Quản lý sản phẩm (chỉ Quản lý) ----------
    @GetMapping("/san-pham")
    public String sanPham(Model m) {
        m.addAttribute("dsSp", sanPhamRepo.findAllByOrderByLoaiSanPhamAscTenSanPhamAsc());
        return "san-pham";
    }

    @PostMapping("/san-pham/luu")
    public String luuSp(@RequestParam(required = false) Integer maSanPham, @RequestParam String tenSanPham,
                        @RequestParam(required = false) String loaiSanPham, @RequestParam(required = false) String donViTinh,
                        @RequestParam Long giaBan, @RequestParam(required = false) Integer mucTonToiThieu,
                        @RequestParam(required = false) Integer soLuongTon, @RequestParam(required = false) String ghiChu,
                        RedirectAttributes ra) {
        khoService.luuSanPham(maSanPham, tenSanPham, loaiSanPham, donViTinh, giaBan, mucTonToiThieu, soLuongTon, ghiChu);
        ra.addFlashAttribute("thongBao", "Đã lưu sản phẩm.");
        return "redirect:/dich-vu/san-pham";
    }

    @PostMapping("/san-pham/{id}/ngung")
    public String ngung(@PathVariable Integer id, @RequestParam boolean ngung, RedirectAttributes ra) {
        khoService.doiTrangThaiSanPham(id, ngung);
        ra.addFlashAttribute("thongBao", ngung ? "Đã ngừng kinh doanh sản phẩm." : "Đã kinh doanh lại sản phẩm.");
        return "redirect:/dich-vu/san-pham";
    }

    @PostMapping("/san-pham/{id}/hong")
    public String hong(@PathVariable Integer id, @RequestParam int soLuong, @RequestParam(required = false) String lyDo, RedirectAttributes ra) {
        khoService.ghiHong(id, soLuong, lyDo);
        ra.addFlashAttribute("thongBao", "Đã ghi nhận hàng hỏng và trừ tồn kho.");
        return "redirect:/dich-vu/san-pham";
    }
}
