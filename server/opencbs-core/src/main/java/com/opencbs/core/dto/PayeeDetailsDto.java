package com.opencbs.core.dto;

import lombok.Data;

@Data
public class PayeeDetailsDto extends BaseDto {

    private String name;
    private String description;
    private String accountName;
    private String accountNumber;
    private Long accountId;

}
