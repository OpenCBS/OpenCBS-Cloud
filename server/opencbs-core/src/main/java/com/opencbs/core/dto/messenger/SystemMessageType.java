package com.opencbs.core.dto.messenger;

import lombok.Getter;

public enum SystemMessageType {
    INFO("info"),
    SUCCESS("success"),
    ERROR("error"),
    WARNING("warning");

    @Getter
    private String type;

    SystemMessageType(String type) {
        this.type = type;
    }
}