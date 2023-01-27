package com.opencbs.core.domain.enums;

public enum AccountType {
    CATEGORY(1),
    GROUP(2),
    SUBGROUP(3),
    BALANCE(4);
    private Integer Id;

    AccountType(int id) {
        this.Id = id;
    }

    public Integer getId() {
        return Id;
    }

    public static AccountType getById(Integer id) {
        for (AccountType type : AccountType.values()) {
            if (type.getId().equals(id)) {
                return type;
            }
        }
        throw new IllegalArgumentException();
    }
}
