package com.opencbs.termdeposite.dto;

import com.opencbs.core.domain.BaseEntity;
import com.opencbs.termdeposite.domain.enums.TermDepositStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TermDepositSimplified extends BaseEntity {

    private String code;
    private String profileName;
    private Long profileId;
    private String serviceOfficerFirstName;
    private String serviceOfficerLastName;
    private Long serviceOfficerId;
    private LocalDateTime openDate;
    private String productName;
    private Long productId;
    private TermDepositStatus status;
    private LocalDateTime createdAt;

}
