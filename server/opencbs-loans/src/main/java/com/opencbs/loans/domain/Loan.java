package com.opencbs.loans.domain;

import com.opencbs.core.domain.User;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.loans.domain.enums.LoanStatus;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)

@SqlResultSetMapping(name="loanAdditionalInfoMapper",
        classes = {
                @ConstructorResult(
                        targetClass = LoanAdditionalInfo.class,
                        columns = {
                                @ColumnResult(name = "settlement_balance", type = BigDecimal.class),
                                @ColumnResult(name = "olb", type = BigDecimal.class),
                                @ColumnResult(name = "late_amount", type = BigDecimal.class),
                                @ColumnResult(name = "unallocated_amount", type = BigDecimal.class)
                        })
        })
@Entity
@Table(name = "loans")
public class Loan extends LoanBaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private LoanStatus status = LoanStatus.ACTIVE;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_application_id")
    private LoanApplication loanApplication;

    @OneToMany(mappedBy = "loan", fetch = FetchType.LAZY, cascade = {CascadeType.REFRESH})
    List<LoanAccount> loanAccountList;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;

    @OneToMany(mappedBy = "loan", fetch = FetchType.LAZY, cascade = {CascadeType.ALL})
    private List<LoanPenaltyAccount> loanPenaltyAccountList = new ArrayList<>();

    @OneToMany(mappedBy = "loan", fetch = FetchType.LAZY, cascade = {CascadeType.REFRESH})
    private List<LoanSpecificProvision> loanSpecificProvisions;

    @Column(name = "schedule_manual_edited", nullable = false)
    private Boolean scheduleManualEdited = Boolean.FALSE;

    @Column(name = "schedule_manual_edited_at")
    private LocalDateTime scheduleManualEditedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_manual_edited_by_id")
    private User scheduleManualEditedBy;
}
