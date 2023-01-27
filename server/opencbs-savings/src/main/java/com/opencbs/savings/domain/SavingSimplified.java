package com.opencbs.savings.domain;

import com.opencbs.core.domain.BaseEntity;
import com.opencbs.savings.domain.enums.SavingStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SavingSimplified extends BaseEntity {
    private String code;
    private String profileName;
    private Long profileId;
    private String savingOfficerFirstName;
    private String savingOfficerLastName;
    private Long savingOfficerId;
    private LocalDateTime openDate;
    private String productName;
    private Long productId;
    private SavingStatus status;
}
