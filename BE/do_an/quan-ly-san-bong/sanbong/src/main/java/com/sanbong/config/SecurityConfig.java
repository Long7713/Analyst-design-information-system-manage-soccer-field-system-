package com.sanbong.config;

import com.sanbong.entity.TaiKhoan;
import com.sanbong.repository.TaiKhoanRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/** Đăng nhập + phân quyền: QUAN_LY toàn quyền, NHAN_VIEN bị giới hạn. */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final TaiKhoanRepo taiKhoanRepo;

    @Bean
    public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            TaiKhoan tk = taiKhoanRepo.findByTenDangNhap(username)
                    .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy tài khoản"));
            boolean khoa = !"hoat_dong".equals(tk.getTrangThai()) || !"dang_lam".equals(tk.getNhanVien().getTrangThai());
            return User.withUsername(tk.getTenDangNhap()).password(tk.getMatKhau())
                    .roles(tk.getVaiTro()).disabled(khoa).build();
        };
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(a -> a
                .requestMatchers("/login", "/cong-khai", "/css/**", "/js/**", "/error").permitAll()
                // chỉ Quản lý
                .requestMatchers("/doanh-thu/**", "/thong-ke/**", "/nhan-su/**", "/cai-dat/**", "/nhat-ky/**",
                        "/kho/**", "/thiet-bi/**", "/dich-vu/san-pham/**").hasRole("QUAN_LY")
                .anyRequest().authenticated())
            .formLogin(f -> f.loginPage("/login").defaultSuccessUrl("/lich-san", true).permitAll())
            .logout(l -> l.logoutSuccessUrl("/login?dangxuat").permitAll());
        return http.build();
    }
}
