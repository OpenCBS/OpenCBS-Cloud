package com.opencbs.core.domain.enums;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum  InterestScheme {
    @JsonProperty("FACT/FACT")
    FACT_FACT,

    @JsonProperty("30/360")
    THIRTY_THREE_HUNDRED_SIXTY
}
