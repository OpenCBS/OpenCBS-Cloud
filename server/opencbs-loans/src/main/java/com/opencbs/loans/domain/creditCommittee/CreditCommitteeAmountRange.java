package com.opencbs.loans.domain.creditCommittee;

import com.opencbs.core.domain.CreationInfoEntity;
import com.opencbs.core.domain.Role;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.util.List;

@Data
@Entity
@Table(name = "credit_committee_amount_range")
public class CreditCommitteeAmountRange extends CreationInfoEntity {

    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @ManyToMany
    @JoinTable(
            name = "credit_committee_roles",
            joinColumns = @JoinColumn(name = "credit_committee_amount_range_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"))
    private List<Role> roles;
}