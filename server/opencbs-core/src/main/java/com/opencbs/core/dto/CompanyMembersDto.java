package com.opencbs.core.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CompanyMembersDto extends BaseDto {

    private String name;
    private String type;
    private Long companyId;
    private Long memberId;
    private LocalDateTime joinDate;
    private LocalDateTime leftDate;

}
