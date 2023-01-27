package com.opencbs.core.accounting.domain;

import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.domain.enums.AccountType;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Immutable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@EqualsAndHashCode(callSuper = true)

@Entity
@Immutable
@Table(name = "accounts")
public class AccountEntityType extends BaseEntity {

    @Column(name = "type")
    private AccountType type;
}
