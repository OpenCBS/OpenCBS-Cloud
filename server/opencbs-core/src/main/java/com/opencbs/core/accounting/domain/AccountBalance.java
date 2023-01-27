package com.opencbs.core.accounting.domain;

import com.opencbs.core.domain.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)

@Entity
@Table(name = "account_balances")
public class AccountBalance extends BaseEntity {

    @Column(name = "account_id", nullable = false)
    private Long accountId;

    @Transient
    private Long parentId;

    @Column(name = "balance", nullable = false, precision = 14, scale = 2)
    private BigDecimal balance;

    @Column(name = "date", nullable = false)
    private LocalDateTime date;
}