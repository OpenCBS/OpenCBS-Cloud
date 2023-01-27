package com.opencbs.core.domain.enums;

public enum UserFieldType{

    USER_NAME("Username"),
    FIRST_NAME("First name"),
    LAST_NAME("Last name"),
    PASSWORD("Password"),
    EMAIL("Email"),
    PHONE_NUMBER("Phone number");

    private String type;

    UserFieldType(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }
}
