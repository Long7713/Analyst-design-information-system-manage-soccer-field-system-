package com.sanbong.service;

import com.sanbong.entity.*;
import com.sanbong.repository.*;
import com.sanbong.util.NghiepVuException;
import com.sanbong.util.QuyDinh;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NhanSuService {
    private final NhanVienRepo nvRepo;
    private final TaiKhoanRepo tkRepo;
    private final CaLamViecRepo caRepo;
    private final PasswordEncoder encoder;
    private final NhatKyService nhatKy;
    private final NguoiDungService nguoiDung;

    @Transactional
    public NhanVien luu(Integer id, String hoTen, String sdt, LocalDate ngaySinh, String diaChi, LocalDate ngayVaoLam,
                        Long luongGio, String tenDangNhap, String matKhau, String vaiTro) {
        if (hoTen == null || hoTen.isBlank()) throw new NghiepVuException("Vui lòng nhập họ tên nhân viên.");
        NhanVien nv = id == null ? new NhanVien() : nvRepo.findById(id).orElseThrow(() -> new NghiepVuException("Không tìm thấy nhân viên."));
        nv.setHoTen(hoTen.trim());
        nv.setSoDienThoai(sdt);
        nv.setNgaySinh(ngaySinh);
        nv.setDiaChi(diaChi);
        nv.setNgayVaoLam(ngayVaoLam == null ? LocalDate.now() : ngayVaoLam);
        nv.setMucLuongGio(luongGio == null ? QuyDinh.LUONG_GIO_MAC_DINH : luongGio);
        nv = nvRepo.save(nv);

        Optional<TaiKhoan> tkCu = tkRepo.findByNhanVien_MaNv(nv.getMaNv());
        if (tenDangNhap != null && !tenDangNhap.isBlank()) {
            String ten = tenDangNhap.trim();
            Optional<TaiKhoan> trung = tkRepo.findByTenDangNhap(ten);
            if (trung.isPresent() && !trung.get().getNhanVien().getMaNv().equals(nv.getMaNv()))
                throw new NghiepVuException("Tên đăng nhập \"" + ten + "\" đã tồn tại.");
            TaiKhoan tk = tkCu.orElseGet(TaiKhoan::new);
            if (tk.getMaTk() == null) {
                if (matKhau == null || matKhau.length() < 6) throw new NghiepVuException("Mật khẩu tài khoản mới phải từ 6 ký tự.");
                tk.setNhanVien(nv);
            }
            tk.setTenDangNhap(ten);
            if (matKhau != null && !matKhau.isBlank()) {
                if (matKhau.length() < 6) throw new NghiepVuException("Mật khẩu phải từ 6 ký tự.");
                tk.setMatKhau(encoder.encode(matKhau));
            }
            tk.setVaiTro("QUAN_LY".equals(vaiTro) ? "QUAN_LY" : "NHAN_VIEN");
            tkRepo.save(tk);
        }
        nhatKy.ghi(id == null ? "THEM_NHAN_VIEN" : "SUA_NHAN_VIEN", "NV #" + nv.getMaNv(), nv.getHoTen());
        return nv;
    }

    /** Không xóa nhân viên: chỉ đổi trạng thái (dang_lam / nghi_viec / tam_khoa). */
    @Transactional
    public void doiTrangThai(Integer id, String trangThai) {
        NhanVien nv = nvRepo.findById(id).orElseThrow(() -> new NghiepVuException("Không tìm thấy nhân viên."));
        NhanVien toi = nguoiDung.hienTai();
        if (toi != null && toi.getMaNv().equals(id) && !"dang_lam".equals(trangThai))
            throw new NghiepVuException("Bạn không thể tự khóa chính mình.");
        nv.setTrangThai(trangThai);
        tkRepo.findByNhanVien_MaNv(id).ifPresent(tk -> tk.setTrangThai("dang_lam".equals(trangThai) ? "hoat_dong" : "tam_khoa"));
        nhatKy.ghi("DOI_TRANG_THAI_NV", "NV #" + id, nv.getHoTen() + " → " + trangThai);
    }

    @Transactional
    public void themCa(Integer maNv, LocalDate ngay, LocalTime bd, String ketThuc) {
        NhanVien nv = nvRepo.findById(maNv).orElseThrow(() -> new NghiepVuException("Không tìm thấy nhân viên."));
        LocalTime kt = QuyDinh.parseGio(ketThuc);
        if (QuyDinh.phutKetThuc(kt) <= QuyDinh.phutBatDau(bd)) throw new NghiepVuException("Giờ kết thúc phải sau giờ bắt đầu.");
        CaLamViec ca = new CaLamViec();
        ca.setNhanVien(nv); ca.setNgayLam(ngay); ca.setGioBatDau(bd); ca.setGioKetThuc(kt);
        ca.setMucLuongGio(nv.getMucLuongGio()); // lưu cố định mức lương tại thời điểm làm
        caRepo.save(ca);
        nhatKy.ghi("THEM_CA_LAM", "NV #" + maNv, nv.getHoTen() + " " + ngay + " " + bd + "→" + QuyDinh.gioKetThucStr(kt));
    }

    @Transactional
    public void xoaCa(Integer maCa) {
        caRepo.deleteById(maCa);
        nhatKy.ghi("XOA_CA_LAM", "Ca #" + maCa, "");
    }

    @Transactional
    public void doiMatKhau(String cu, String moi) {
        TaiKhoan tk = nguoiDung.taiKhoanHienTai();
        if (tk == null) throw new NghiepVuException("Chưa đăng nhập.");
        if (!encoder.matches(cu, tk.getMatKhau())) throw new NghiepVuException("Mật khẩu hiện tại không đúng.");
        if (moi == null || moi.length() < 6) throw new NghiepVuException("Mật khẩu mới phải từ 6 ký tự.");
        tk.setMatKhau(encoder.encode(moi));
        nhatKy.ghi("DOI_MAT_KHAU", "TK " + tk.getTenDangNhap(), "");
    }
}
