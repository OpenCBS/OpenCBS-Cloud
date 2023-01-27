package com.opencbs.core.officedocuments.domain;

import lombok.Data;

@Data
public abstract class Request {
    private Integer templateId;
    private String reportName;
}
