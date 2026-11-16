package com.sanbong.controller;

import com.sanbong.dto.DongDoanhThu;
import com.sanbong.entity.DatSan;
import com.sanbong.repository.DatSanRepo;
import com.sanbong.repository.SanBongRepo;
import com.sanbong.service.ThongKeService;
import com.sanbong.util.QuyDinh;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class TongQuanController {
    private final DatSanRepo datSanRepo;
    private final SanBongRepo sanRepo;
    private final ThongKeService thongKe;

    @GetMapping("/tong-quan")
    public String tongQuan(Model m) {
        LocalDateTime now = LocalDateTime.now();
        LocalDate hn = now.toLocalDate();
        List<DatSan> homNay = datSanRepo.findByNgayDat(hn);
        Set<Integer> sanBan = new HashSet<>();
        int dangDa = 0, sapDen = 0, daHuy = 0;
        for (DatSan d : homNay) {
            String tt = d.getTrangThai();
            if (QuyDinh.DA_HUY.equals(tt)) daHuy++;
            if (QuyDinh.DANG_DA.equals(tt)) { dangDa++; sanBan.add(d.getSanBong().getMaSan()); }
            boolean cho = QuyDinh.CHO_XAC_NHAN.equals(tt) || QuyDinh.DA_XAC_NHAN.equals(tt);
            if (cho && !now.isBefore(d.getBatDauDt().minusMinutes(QuyDinh.PHUT_GIO_VANG)) && now.isBefore(d.getBatDauDt())) sapDen++;
            if (cho && !now.isBefore(d.getBatDauDt()) && now.isBefore(d.getKetThucDt())) sanBan.add(d.getSanBong().getMaSan());
        }
        long tongSan = sanRepo.count();
        DongDoanhThu dtHn = thongKe.tong(thongKe.doanhThu(hn, hn, "ngay"), "Hôm nay");

        // 7 ngày gần nhất
        LocalDate tu = hn.minusDays(6);
        Map<String, Long> dt = new HashMap<>();
        for (DongDoanhThu d : thongKe.doanhThu(tu, hn, "ngay")) dt.put(d.getNhan(), d.getTong());
        Map<LocalDate, Integer> luot = new HashMap<>();
        for (DatSan d : datSanRepo.findByNgayDatBetween(tu, hn)) if (d.isDangChiemSan()) luot.merge(d.getNgayDat(), 1, Integer::sum);
        List<String> nhan = new ArrayList<>();
        List<Long> vDt = new ArrayList<>();
        List<Integer> vLuot = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            LocalDate d = tu.plusDays(i);
            String l = d.format(DateTimeFormatter.ofPattern("dd/MM"));
            nhan.add(l); vDt.add(dt.getOrDefault(l, 0L)); vLuot.add(luot.getOrDefault(d, 0));
        }
        LocalDate dauThang = hn.withDayOfMonth(1);
        List<ThongKeService.SanThongKe> topSan = new ArrayList<>(thongKe.thongKeSan(dauThang, hn));
        topSan.sort(Comparator.comparingDouble(ThongKeService.SanThongKe::getSoGio).reversed());
        List<ThongKeService.SpBan> topDv = thongKe.topDichVu(dauThang, hn);

        m.addAttribute("tongSan", tongSan);
        m.addAttribute("sanTrong", Math.max(tongSan - sanBan.size(), 0));
        m.addAttribute("sapDen", sapDen);
        m.addAttribute("dangDa", dangDa);
        m.addAttribute("daHuy", daHuy);
        m.addAttribute("soDon", homNay.size());
        m.addAttribute("doanhThu", dtHn);
        m.addAttribute("nhan", nhan);
        m.addAttribute("vDt", vDt);
        m.addAttribute("vLuot", vLuot);
        m.addAttribute("topSan", topSan.size() > 5 ? topSan.subList(0, 5) : topSan);
        m.addAttribute("topDv", topDv.size() > 5 ? topDv.subList(0, 5) : topDv);
        return "tong-quan";
    }
}
