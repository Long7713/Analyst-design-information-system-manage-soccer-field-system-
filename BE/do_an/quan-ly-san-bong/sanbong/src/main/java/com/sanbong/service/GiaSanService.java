package com.sanbong.service;

import com.sanbong.entity.BangGia;
import com.sanbong.repository.BangGiaRepo;
import com.sanbong.util.NghiepVuException;
import com.sanbong.util.QuyDinh;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/** Tính tiền sân theo bảng giá lưu trong DB (ngày thường / cuối tuần + khung giờ). */
@Service
@RequiredArgsConstructor
public class GiaSanService {
    private final BangGiaRepo repo;

    @Value("${app.gia.theo-gio-bat-dau:false}")
    private boolean theoGioBatDau;

    private List<BangGia> bangGiaApDung(LocalDate ngay) {
        String loai = QuyDinh.cuoiTuan(ngay) ? "cuoi_tuan" : "ngay_thuong";
        return repo.findByKichHoatTrue().stream()
                .filter(b -> loai.equals(b.getLoaiNgay()))
                .filter(b -> b.getApDungTu() == null || !ngay.isBefore(b.getApDungTu()))
                .filter(b -> b.getApDungDen() == null || !ngay.isAfter(b.getApDungDen()))
                .toList();
    }

    private long gia(List<BangGia> ds, int phut) {
        return ds.stream()
                .filter(b -> QuyDinh.phutBatDau(b.getGioBatDau()) <= phut && phut < QuyDinh.phutKetThuc(b.getGioKetThuc()))
                .max(Comparator.comparing((BangGia b) -> b.getApDungTu() != null).thenComparing(BangGia::getMaBangGia))
                .map(BangGia::getGiaMoiGio)
                .orElseThrow(() -> new NghiepVuException("Chưa cấu hình bảng giá cho khung giờ " + QuyDinh.gioStr(phut)));
    }

    /** Giá 1 giờ tại thời điểm (phút trong ngày). */
    public long giaTaiGio(LocalDate ngay, int phut) {
        return gia(bangGiaApDung(ngay), phut);
    }

    /** Tiền sân từ phút bd đến phút kt. Đi qua 2 khung giá thì tính từng khung. */
    public long tinhTien(LocalDate ngay, int bd, int kt) {
        List<BangGia> ds = bangGiaApDung(ngay);
        if (theoGioBatDau) return Math.round(gia(ds, bd) * (kt - bd) / 60.0);
        double tong = 0;
        for (int p = bd; p < kt; p += 30) {
            tong += gia(ds, p) * Math.min(30, kt - p) / 60.0;
        }
        return Math.round(tong);
    }
}
