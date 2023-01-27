package com.opencbs.core.domain;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Data
@Table(name = "profiles_accounts")
public class ProfileAccounts extends BaseEntity {

    @Column(name = "profile_id", nullable = false)
    private Long profileId;

    @Column(name = "account_id", nullable = false)
    private Long accountId;
}
