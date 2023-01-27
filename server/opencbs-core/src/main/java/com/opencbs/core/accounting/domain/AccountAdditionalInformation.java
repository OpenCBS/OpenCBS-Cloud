package com.opencbs.core.accounting.domain;

import com.opencbs.core.domain.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Immutable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@EqualsAndHashCode(callSuper = true)

@Entity
@Table(name = "accounts")
@Immutable
public class AccountAdditionalInformation extends BaseEntity {

    @Column(name = "is_debit")
    private Boolean isDebit;

    @Column(name = "parent_id")
    private Long parentId;
}