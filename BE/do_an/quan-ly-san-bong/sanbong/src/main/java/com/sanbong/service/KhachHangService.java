package com.sanbong.service;

import com.sanbong.dto.KhachThongKe;
import com.sanbong.entity.DatSan;
import com.sanbong.entity.KhachHang;
import com.sanbong.repository.DatSanRepo;
import com.sanbong.repository.KhachHangRepo;
import com.sanbong.util.NghiepVuException;
import com.sanbong.util.QuyDinh;
import java.time.LocalDate;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Số liệu khách hàng đều TÍNH từ bảng dat_san (không lưu riêng). */
@Service
@RequiredArgsConstructor
public class KhachHangService {
    private final KhachHangRepo khachRepo;
    private final DatSanRepo datSanRepo;
    private final NhatKyService nhatKy;

    /** Thống kê mọi khách; tu/den = null nghĩa là toàn thời gian. */
    @Transactional(readOnly = true)
    public Map<Integer, KhachThongKe> thongKeTatCa(LocalDate tu, LocalDate den) {
        Map<Integer, KhachThongKe> map = new LinkedHashMap<>();
        for (KhachHang k : khachRepo.findAll()) {
            KhachThongKe t = new KhachThongKe();
            t.setKhach(k);
            map.put(k.getMaKh(), t);
        }
        List<DatSan> ds = (tu == null || den == null) ? datSanRepo.findAll() : datSanRepo.findByNgayDatBetween(tu, den);
        for (DatSan d : ds) {
            KhachThongKe t = map.get(d.getKhachHang().getMaKh());
            if (t == null) continue;
            t.setSoLanDat(t.getSoLanDat() + 1);
            switch (d.getTrangThai()) {
                case QuyDinh.DA_DA_XONG:
                    t.setSoLanDa(t.getSoLanDa() + 1);
                    t.setTongGio(t.getTongGio() + d.getSoPhut() / 60.0);
                    t.setTongChi(t.getTongChi() + d.getTongTien());
                    break;
                case QuyDinh.DA_HUY: t.setSoLanHuy(t.getSoLanHuy() + 1); break;
                case QuyDinh.KHACH_BOOM: t.setSoLanBoom(t.getSoLanBoom() + 1); break;
                default: break;
            }
            if (t.getNgayGanNhat() == null || d.getNgayDat().isAfter(t.getNgayGanNhat())) t.setNgayGanNhat(d.getNgayDat());
        }
        return map;
    }

    @Transactional
    public KhachHang luu(Integer maKh, String ten, String sdt, String ghiChu) {
        String so = QuyDinh.chuanHoaSdt(sdt);
        if (ten == null || ten.isBlank()) throw new NghiepVuException("Vui lòng nhập tên khách hàng.");
        if (!so.matches("\\d{8,12}")) throw new NghiepVuException("Số điện thoại không hợp lệ.");
        Optional<KhachHang> trung = khachRepo.findBySoDienThoai(so);
        if (trung.isPresent() && !trung.get().getMaKh().equals(maKh))
            throw new NghiepVuException("Số điện thoại này đã thuộc khách hàng \"" + trung.get().getTenKh() + "\".");
        KhachHang k = maKh == null ? new KhachHang()
                : khachRepo.findById(maKh).orElseThrow(() -> new NghiepVuException("Không tìm thấy khách hàng."));
        k.setTenKh(ten.trim());
        k.setSoDienThoai(so);
        k.setGhiChu(ghiChu);
        k = khachRepo.save(k);
        nhatKy.ghi(maKh == null ? "THEM_KHACH" : "SUA_KHACH", "Khách #" + k.getMaKh(), k.getTenKh() + " - " + so);
        return k;
    }
}
