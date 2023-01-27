package com.opencbs.core.domain;

import lombok.Data;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.List;

@Data
@Entity
@Table(name = "transaction_template")
public class TransactionTemplate extends NamedBaseEntity {

    @OneToMany(mappedBy = "transactionTemplate", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    private List<TransactionTemplateAccounts> accounts;
}
