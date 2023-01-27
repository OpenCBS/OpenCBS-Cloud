package com.opencbs.core.domain.enums;

import java.util.HashMap;
import java.util.Map;

public enum ProfileType {

    PERSON(1),
    COMPANY(2),
    GROUP(4);

    private int id;

    private static final Map<String, ProfileType> stringToEnum = new HashMap<>();

    static {
        for (ProfileType profileType : ProfileType.values()) {
            stringToEnum.put(profileType.toString(), profileType);
        }
    }

    public static ProfileType fromString(String symbol) {
        return stringToEnum.get(symbol);
    }

    ProfileType(int id) {
        this.id = id;
    }

    public int getId() {
        return this.id;
    }
}
