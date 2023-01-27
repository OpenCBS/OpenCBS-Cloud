package com.opencbs.loans.domain;

import com.opencbs.core.domain.User;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.loans.credit.lines.domain.CreditLine;
import com.opencbs.loans.domain.attachments.LoanApplicationAttachment;
import com.opencbs.loans.domain.creditCommittee.CreditCommitteeVote;
import com.opencbs.loans.domain.customfields.LoanApplicationCustomFieldValue;
import com.opencbs.loans.domain.enums.LoanApplicationStatus;
import com.opencbs.loans.domain.products.LoanProduct;
import com.opencbs.loans.domain.schedules.installments.LoanApplicationInstallment;
import lombok.Data;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Data
@Table(name = "loan_applications")
public class LoanApplication extends LoanBaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private LoanApplicationStatus status = LoanApplicationStatus.IN_PROGRESS;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_product_id", nullable = false)
    private LoanProduct loanProduct;

    @OneToMany(mappedBy = "loanApplication", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    @OrderBy("number ASC")
    private List<LoanApplicationInstallment> installments;

    @OneToMany(mappedBy = "owner", cascade = {CascadeType.REFRESH})
    private List<LoanApplicationAttachment> attachments;

    @OneToMany(mappedBy = "loanApplication", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    private List<LoanApplicationPayees> loanApplicationPayees;

    @OneToMany(mappedBy = "loanApplication")
    private Set<Collateral> collaterals;

    @OneToMany(mappedBy = "loanApplication", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    private List<LoanApplicationEntryFee> loanApplicationEntryFees;

    @OneToMany(mappedBy = "loanApplication")
    private List<Guarantor> guarantors;

    @OneToMany(mappedBy = "loanApplication", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    private List<CreditCommitteeVote> creditCommitteeVotes = new ArrayList<>();

    @OneToMany(mappedBy = "owner", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<LoanApplicationCustomFieldValue> customFieldValues;

    @OneToMany(mappedBy = "loanApplication", cascade = {CascadeType.ALL}, orphanRemoval = true)
    private List<LoanApplicationPenalty> loanApplicationPenalties = new ArrayList<>();

    @Column(name = "schedule_manual_edited", nullable = false)
    private Boolean scheduleManualEdited = Boolean.FALSE;

    @Column(name = "schedule_manual_edited_at")
    private LocalDateTime scheduleManualEditedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_manual_edited_by_id")
    private User scheduleManualEditedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "credit_line_id")
    private CreditLine creditLine;


    public void setInstallments(List<LoanApplicationInstallment> installments) {
        if (this.installments == null) this.installments = new ArrayList<>();
        this.installments.clear();
        if (installments != null) this.installments.addAll(installments);
    }
}
