package com.sanbong.service;

import com.sanbong.entity.BangGia;
import com.sanbong.entity.SanBong;
import com.sanbong.repository.BangGiaRepo;
import com.sanbong.repository.SanBongRepo;
import com.sanbong.util.NghiepVuException;
import com.sanbong.util.QuyDinh;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CaiDatService {
    private final BangGiaRepo bangGiaRepo;
    private final SanBongRepo sanRepo;
    private final NhatKyService nhatKy;

    @Transactional
    public void luuBangGia(Integer id, String loaiNgay, String batDau, String ketThuc, Long gia, LocalDate tu, LocalDate den, boolean kichHoat) {
        if (gia == null || gia <= 0) throw new NghiepVuException("Giá sân phải lớn hơn 0.");
        int bd = QuyDinh.phutBatDau(QuyDinh.parseGio(batDau));
        int kt = QuyDinh.phutKetThuc(QuyDinh.parseGio(ketThuc));
        if (kt <= bd) throw new NghiepVuException("Giờ kết thúc khung giá phải sau giờ bắt đầu.");
        if (tu != null && den != null && den.isBefore(tu)) throw new NghiepVuException("Ngày kết thúc áp dụng phải sau ngày bắt đầu.");
        BangGia b = id == null ? new BangGia() : bangGiaRepo.findById(id).orElseThrow(() -> new NghiepVuException("Không tìm thấy bảng giá."));
        long giaCu = b.getGiaMoiGio() == null ? 0 : b.getGiaMoiGio();
        b.setLoaiNgay("cuoi_tuan".equals(loaiNgay) ? "cuoi_tuan" : "ngay_thuong");
        b.setGioBatDau(QuyDinh.parseGio(batDau));
        b.setGioKetThuc(QuyDinh.parseGio(ketThuc));
        b.setGiaMoiGio(gia);
        b.setApDungTu(tu);
        b.setApDungDen(den);
        b.setKichHoat(kichHoat);
        b = bangGiaRepo.save(b);
        nhatKy.ghi(id == null ? "THEM_BANG_GIA" : "SUA_BANG_GIA", "Bảng giá #" + b.getMaBangGia(),
                b.getLoaiNgay() + " " + b.getBatDauStr() + "→" + b.getKetThucStr() + ": " + QuyDinh.tien(giaCu) + " ⇒ " + QuyDinh.tien(gia));
    }

    @Transactional
    public void batTatBangGia(Integer id) {
        BangGia b = bangGiaRepo.findById(id).orElseThrow(() -> new NghiepVuException("Không tìm thấy bảng giá."));
        b.setKichHoat(!Boolean.TRUE.equals(b.getKichHoat()));
        nhatKy.ghi("BAT_TAT_BANG_GIA", "Bảng giá #" + id, Boolean.TRUE.equals(b.getKichHoat()) ? "Bật" : "Tắt");
    }

    @Transactional
    public void capNhatSan(Integer maSan, String trangThai, String ghiChu) {
        SanBong s = sanRepo.findById(maSan).orElseThrow(() -> new NghiepVuException("Không tìm thấy sân."));
        s.setTrangThai("ngung_hoat_dong".equals(trangThai) ? "ngung_hoat_dong" : "hoat_dong");
        s.setGhiChu(ghiChu);
        nhatKy.ghi("CAP_NHAT_SAN", s.getTen(), s.getTrangThai() + (ghiChu == null ? "" : " - " + ghiChu));
    }
}
