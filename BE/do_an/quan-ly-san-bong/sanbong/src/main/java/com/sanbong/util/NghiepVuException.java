package com.sanbong.util;

/** Lỗi nghiệp vụ: hiển thị thông báo đỏ cho người dùng. */
public class NghiepVuException extends RuntimeException {
    public NghiepVuException(String message) { super(message); }
}
