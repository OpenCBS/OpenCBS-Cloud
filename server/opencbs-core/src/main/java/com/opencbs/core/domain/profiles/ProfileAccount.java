package com.opencbs.core.domain.profiles;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Immutable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Data
@EqualsAndHashCode(callSuper = true)

@Entity
@Immutable
@Table(name = "profiles_accounts")
public class ProfileAccount extends BaseEntity {

    @Column(name = "profile_id")
    private Long profileId;

    @OneToOne
    @JoinColumn(name = "account_id")
    private Account account;
}
