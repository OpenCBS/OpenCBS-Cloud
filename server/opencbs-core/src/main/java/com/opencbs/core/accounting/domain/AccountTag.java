package com.opencbs.core.accounting.domain;

import com.opencbs.core.domain.BaseEntity;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "account_tags")
public class AccountTag extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "name", nullable = false)
    private AccountTagType name;
}