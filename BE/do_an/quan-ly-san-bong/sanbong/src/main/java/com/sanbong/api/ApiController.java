package com.sanbong.api;

import com.sanbong.dto.KetQua;
import com.sanbong.entity.KhachHang;
import com.sanbong.repository.KhachHangRepo;
import com.sanbong.service.DatSanService;
import com.sanbong.util.NghiepVuException;
import com.sanbong.util.QuyDinh;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.LinkedHashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

/** API JSON để giao diện kiểm tra "Sân trống / Sân đã được đặt" ngay khi chọn giờ. */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ApiController {
    private final DatSanService datSanService;
    private final KhachHangRepo khachRepo;

    @ExceptionHandler(NghiepVuException.class)
    public KetQua loi(NghiepVuException e) { return KetQua.loi(e.getMessage()); }

    @GetMapping("/kiem-tra-dat")
    public KetQua kiemTraDat(@RequestParam Integer maSan,
                             @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngay,
                             @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime batDau,
                             @RequestParam int soPhut) {
        return datSanService.kiemTraDat(maSan, ngay, batDau, soPhut, null);
    }

    @GetMapping("/kiem-tra-doi")
    public KetQua kiemTraDoi(@RequestParam Integer id,
                             @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime batDau,
                             @RequestParam int soPhut) {
        return datSanService.kiemTraDoiGio(id, batDau, soPhut);
    }

    @GetMapping("/kiem-tra-them")
    public KetQua kiemTraThem(@RequestParam Integer id, @RequestParam int soPhut) {
        return datSanService.kiemTraThemGio(id, soPhut);
    }

    @GetMapping("/khach")
    public Map<String, Object> khach(@RequestParam String sdt) {
        Map<String, Object> r = new LinkedHashMap<>();
        String so = QuyDinh.chuanHoaSdt(sdt);
        KhachHang k = khachRepo.findBySoDienThoai(so).orElse(null);
        r.put("tim", k != null);
        r.put("ten", k == null ? "" : k.getTenKh());
        r.put("canhBao", k == null ? null : datSanService.canhBaoBoom(so));
        return r;
    }
}
