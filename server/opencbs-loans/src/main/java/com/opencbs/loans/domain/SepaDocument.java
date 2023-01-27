package com.opencbs.loans.domain;

import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.domain.User;
import com.opencbs.loans.domain.enums.SepaDocumentStatus;
import com.opencbs.loans.domain.enums.SepaDocumentType;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "sepa_documents")
public class SepaDocument extends BaseEntity {

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(name = "document_type")
    private SepaDocumentType documentType;

    @Column(name = "uid")
    private String uid;

    @Column(name = "generated_for_date")
    private LocalDate generatedForDate;

    @Column(name = "number_of_taxes")
    private Integer numberOfTaxes;

    @Column(name = "control_sum")
    private BigDecimal controlSum;

    @Column(name = "document_status")
    @Enumerated(value = EnumType.STRING)
    private SepaDocumentStatus documentStatus;
}
