package com.sanbong.dto;

import com.sanbong.entity.SanBong;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

/** Một hàng của lịch sân: 1 sân + các đơn trong ngày. */
@Getter @Setter
public class SanRow {
    private SanBong san;
    private long gia;
    private List<DatSanView> items = new ArrayList<>();
}
