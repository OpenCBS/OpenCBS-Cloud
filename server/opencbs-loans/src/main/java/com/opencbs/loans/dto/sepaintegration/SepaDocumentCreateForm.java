package com.opencbs.loans.dto.sepaintegration;

import com.opencbs.core.domain.User;
import com.opencbs.loans.domain.enums.SepaDocumentStatus;
import com.opencbs.loans.domain.enums.SepaDocumentType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class SepaDocumentCreateForm {

    private LocalDateTime createdAt;

    private User createdBy;

    private SepaDocumentType documentType;

    private String uid;

    private LocalDate generatedForDate;

    private Integer numberOfTaxes;

    private BigDecimal controlSum;

    private SepaDocumentStatus documentStatus;
}
