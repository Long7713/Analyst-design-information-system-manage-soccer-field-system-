package com.sanbong.service;

import com.sanbong.entity.NhatKy;
import com.sanbong.repository.NhatKyRepo;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/** Ghi nhật ký hoạt động: ai - làm gì - lúc nào - tác động đối tượng nào. */
@Service
@RequiredArgsConstructor
public class NhatKyService {
    private final NhatKyRepo repo;
    private final NguoiDungService nguoiDung;

    public void ghi(String thaoTac, String doiTuong, String noiDung) {
        NhatKy n = new NhatKy();
        n.setNhanVien(nguoiDung.hienTai());
        n.setThaoTac(thaoTac);
        n.setDoiTuong(doiTuong);
        n.setNoiDung(noiDung != null && noiDung.length() > 480 ? noiDung.substring(0, 480) : noiDung);
        n.setThoiGian(LocalDateTime.now());
        repo.save(n);
    }
}
