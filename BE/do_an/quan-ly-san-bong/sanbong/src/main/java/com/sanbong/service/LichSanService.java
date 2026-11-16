package com.sanbong.service;

import com.sanbong.dto.*;
import com.sanbong.entity.DatSan;
import com.sanbong.entity.SanBong;
import com.sanbong.repository.DatSanRepo;
import com.sanbong.repository.SanBongRepo;
import com.sanbong.util.QuyDinh;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Dựng dữ liệu lịch sân 12 sân × 07:00-24:00 cho 1 ngày. */
@Service
@RequiredArgsConstructor
public class LichSanService {
    private final SanBongRepo sanRepo;
    private final DatSanRepo datSanRepo;
    private final DatSanService datSanService;
    private final GiaSanService giaSan;

    @Transactional(readOnly = true)
    public LichSanData lichNgay(LocalDate ngay) {
        LocalDateTime now = LocalDateTime.now();
        LichSanData data = new LichSanData();
        List<DatSan> dsDon = datSanRepo.findByNgayDat(ngay);
        dsDon.sort(Comparator.comparing(DatSan::getGioBatDau));
        Map<Integer, List<DatSanView>> theoSan = new HashMap<>();
        for (DatSan d : dsDon) {
            DatSanView v = datSanService.toView(d, now);
            theoSan.computeIfAbsent(v.getMaSan(), k -> new ArrayList<>()).add(v);
            data.getTatCa().add(v);
            switch (v.getTrangThai()) {
                case QuyDinh.DANG_DA: data.setDangDa(data.getDangDa() + 1); break;
                case QuyDinh.DA_XAC_NHAN:
                    if (v.isQuaGio()) data.setQuaGio(data.getQuaGio() + 1); else data.setDaCoc(data.getDaCoc() + 1);
                    break;
                case QuyDinh.CHO_XAC_NHAN:
                    if (v.isQuaGio()) data.setQuaGio(data.getQuaGio() + 1); else data.setChoCoc(data.getChoCoc() + 1);
                    break;
                default: break;
            }
        }
        int phutGia = ngay.equals(now.toLocalDate())
                ? Math.min(Math.max(now.getHour() * 60 + now.getMinute(), QuyDinh.PHUT_MO_CUA), QuyDinh.PHUT_DONG_CUA - 1)
                : 17 * 60;
        for (SanBong s : sanRepo.findAllByOrderByMaSanAsc()) {
            SanRow r = new SanRow();
            r.setSan(s);
            try { r.setGia(giaSan.giaTaiGio(ngay, phutGia)); } catch (RuntimeException e) { r.setGia(0); }
            r.setItems(theoSan.getOrDefault(s.getMaSan(), new ArrayList<>()));
            data.getRows().add(r);
        }
        return data;
    }
}
