package com.opencbs.savings.domain;

import com.opencbs.core.contracts.Contract;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Immutable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)

@Entity
@Immutable
@Table(name = "savings")
public class SavingManagementFee extends Contract {

    @Column(name = "management_fee_rate")
    private BigDecimal managementFeeRate;

    @Column(name = "management_fee_flat")
    private BigDecimal managementFeeFlat;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "saving_product_id")
    private SavingProductSimple product;

    @Column(name = "profile_id")
    private Long profileId;
}
