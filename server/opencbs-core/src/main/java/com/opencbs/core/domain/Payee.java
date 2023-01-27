package com.opencbs.core.domain;

import com.opencbs.core.accounting.domain.Account;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import java.util.Set;

@Entity
@Table(name = "payees")
@Data
public class Payee extends BaseEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @ManyToMany
    @JoinTable(name = "payees_accounts",
            joinColumns = @JoinColumn(name = "payee_id"),
            inverseJoinColumns = @JoinColumn(name = "account_id"))
    private Set<Account> payeeAccounts;
}
