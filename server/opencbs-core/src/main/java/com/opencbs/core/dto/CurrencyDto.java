package com.opencbs.core.dto;

import lombok.Data;

@Data
public class CurrencyDto extends BaseDto {

    private String name;
    private String code;
    private boolean isMain;

}
