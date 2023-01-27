package com.opencbs.core.officedocuments.domain;

import lombok.Data;
import org.apache.poi.xssf.usermodel.XSSFCell;

@Data
public class TemplateItem {
    private String template;
    private SourceEnum key;
    private String name;
    private String format;
    private String command;
    private XSSFCell cell;
    private boolean applied;
}
