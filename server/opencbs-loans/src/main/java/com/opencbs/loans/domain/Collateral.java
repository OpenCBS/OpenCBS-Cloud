package com.opencbs.loans.domain;

import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.domain.User;
import com.opencbs.loans.domain.customfields.CollateralCustomFieldValue;
import com.opencbs.loans.domain.customfields.TypeOfCollateral;
import lombok.Data;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "collaterals")
public class Collateral extends BaseEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "amount", precision = 14, scale = 4)
    private BigDecimal amount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_application_id")
    private LoanApplication loanApplication;

    @JoinColumn(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @OneToMany(mappedBy = "collateral", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    private List<CollateralCustomFieldValue> customFieldValues = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_of_collateral_id", nullable = false)
    private TypeOfCollateral typeOfCollateral;

    @JoinColumn(name = "closed_at")
    private LocalDateTime closedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "closed_by_id")
    private User closedBy;

    public void setCustomFieldValues(List<CollateralCustomFieldValue> customFieldValues) {
        this.customFieldValues.clear();
        if (customFieldValues != null) this.customFieldValues.addAll(customFieldValues);
    }
}
