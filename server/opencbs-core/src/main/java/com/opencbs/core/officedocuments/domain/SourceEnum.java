package com.opencbs.core.officedocuments.domain;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum SourceEnum {
    @JsonProperty("parameters")
    PARAMETERS,
    @JsonProperty("items")
    ITEMS,
    @JsonProperty("statics")
    STATICS;

    public static SourceEnum getByName(String name) {
        for (SourceEnum sourceEnum : SourceEnum.values()) {
            if (sourceEnum.toString().equals(name.toUpperCase())) {
                return sourceEnum;
            }
        }
        throw new RuntimeException(String.format("No such element by name = %s", name));
    }
}
