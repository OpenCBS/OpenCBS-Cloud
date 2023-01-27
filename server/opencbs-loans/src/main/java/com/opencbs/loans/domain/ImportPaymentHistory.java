package com.opencbs.loans.domain;

import com.opencbs.core.domain.BaseEntity;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "import_payment_history")


public class ImportPaymentHistory extends BaseEntity {

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "payment_date", nullable = false)
    private LocalDateTime paymentDate;

    @Column(name = "partner_name", nullable = false)
    private String partnerName;

    @Column(name = "repayment_amount", nullable = false)
    private BigDecimal repaymentAmount;

    @Column(name = "formatted_number")
    private String formattedNumber;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "technical_account_number", nullable = false)
    private String technicalAccountNumber;

    @Column(name = "uploading_date")
    private LocalDateTime uploadingDate;
}
