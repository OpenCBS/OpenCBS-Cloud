package com.opencbs.borrowings.domain.schedule;

import com.opencbs.borrowings.domain.Borrowing;
import com.opencbs.core.domain.BaseInstallment;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)

@Entity
@Table(name = "borrowings_installments")
public class BorrowingInstallment extends BaseInstallment {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "borrowing_id", nullable = false)
    private Borrowing borrowing;

    @Transient
    private BigDecimal accruedInterest = BigDecimal.ZERO;

    public BorrowingInstallment() { }

    public BorrowingInstallment(BorrowingInstallment copy) {
        super(copy);
    }
}
