package com.opencbs.core.domain.till;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.domain.Branch;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.util.Set;

@Entity
@Data
@Table(name = "vaults")
public class Vault extends BaseEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @ManyToMany
    @JoinTable(name = "vaults_accounts",
            joinColumns = @JoinColumn(name = "vault_id"),
            inverseJoinColumns = @JoinColumn(name = "account_id"))
    private Set<Account> accounts;
}
