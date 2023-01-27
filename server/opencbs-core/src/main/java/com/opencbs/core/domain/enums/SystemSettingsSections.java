package com.opencbs.core.domain.enums;

public enum SystemSettingsSections {

    PASSWORD(1),
    DATETIME_FORMAT(2),
    NUMBER_FORMAT(3);

    private int id;

    SystemSettingsSections(int id) {
        this.id = id;
    }

    public int getId() {
        return this.id;
    }

}
