package com.opencbs.savings.domain;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Data
@Table(name = "savings_accounts")
public class SavingAccount extends BaseSavingAccount {

    @Column(name = "saving_id", insertable = false, updatable = false)
    private Long savingId;

    @ManyToOne
    @JoinColumn(name = "saving_id", nullable = false)
    private Saving saving;
}
