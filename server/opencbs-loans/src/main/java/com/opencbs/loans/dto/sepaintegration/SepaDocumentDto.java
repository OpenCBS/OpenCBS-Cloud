package com.opencbs.loans.dto.sepaintegration;

import com.opencbs.loans.domain.enums.SepaDocumentStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SepaDocumentDto {

    private String uid;

    private String date;

    private String createdUser;

    private String comment;

    private SepaDocumentStatus status;
}
