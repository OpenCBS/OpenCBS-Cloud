package com.opencbs.borrowings.domain;

import com.opencbs.core.domain.User;
import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.borrowings.domain.enums.BorrowingStatus;
import com.opencbs.borrowings.domain.schedule.BorrowingInstallment;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Table;
import javax.persistence.Column;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Enumerated;
import javax.persistence.EnumType;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.CascadeType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table(name = "borrowings")
public class Borrowing extends BorrowingBaseEntity {

    @Column(name = "grace_period", nullable = false)
    private int gracePeriod;

    @Column(name = "maturity", nullable = false)
    private int maturity;

    @Column(name = "disbursement_date", nullable = false)
    private LocalDateTime disbursementDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    @Column(name = "preferred_repayment_date", nullable = false)
    private LocalDate preferredRepaymentDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private BorrowingStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_officer_id")
    private User loanOfficer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "borrowing_product_id", nullable = false)
    private BorrowingProduct borrowingProduct;

    @OneToMany(mappedBy = "borrowing", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    @OrderBy("number ASC")
    private List<BorrowingInstallment> installments;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "correspondence_account_id", nullable = false)
    private Account correspondenceAccount;

    @OneToMany(mappedBy = "borrowing", cascade = CascadeType.REFRESH)
    private List<BorrowingAccount> borrowingAccounts;
}
