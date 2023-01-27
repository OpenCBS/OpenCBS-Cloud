package com.opencbs.savings.domain;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "saving_product_accounts")
public class SavingProductAccount extends BaseSavingAccount {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "saving_product_id", nullable = false)
    private SavingProduct product;
}
