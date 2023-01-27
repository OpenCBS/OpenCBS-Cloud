package com.opencbs.core.domain.enums;

public enum LookupType {

    LOCATIONS("locations", "Locations"),
    PROFESSIONS("professions", "Professions"),
    BUSINESS_SECTORS("business-sectors", "Business Sectors"),
    PAYMENT_METHODS("payment-methods", "Payment Methods"),
    PEOPLE("profiles/people", "Persons"),
    COMPANIES("profiles/companies", "Companies"),
    GROUPS("profiles/groups", "Groups"),
    USERS("users", "Users"),
    CURRENCIES("currencies", "Currencies"),
    BRANCHES("branches", "Branches"),
    TILLS("tills", "Tills"),
    ACCOUNTS("accounting", "Accounts");

    private String name;
    private String key;

    LookupType(String name, String key) {
        this.name = name;
        this.key = key;
    }

    public String getName() {
        return name;
    }

    public String getKey() {
        return key;
    }

    public static LookupType getByName(String name) {
        for (LookupType type : LookupType.values()) {
            if (type.getName().equalsIgnoreCase(name)) {
                return type;
            }
        }
        throw new IllegalArgumentException();
    }
}
