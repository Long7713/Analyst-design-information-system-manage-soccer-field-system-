package com.sanbong.dto;

import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class LichSanData {
    private List<SanRow> rows = new ArrayList<>();
    private List<DatSanView> tatCa = new ArrayList<>();
    private int dangDa, daCoc, choCoc, quaGio;
}
