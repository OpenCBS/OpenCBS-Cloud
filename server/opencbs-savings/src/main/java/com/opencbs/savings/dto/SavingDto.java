package com.opencbs.savings.dto;

import lombok.Data;

@Data
public class SavingDto extends BaseSavingDto {

    private Long profileId;
    private Long savingProductId;
    private Long savingOfficerId;

}
