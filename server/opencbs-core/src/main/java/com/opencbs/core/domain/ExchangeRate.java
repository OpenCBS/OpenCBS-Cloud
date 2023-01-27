package com.opencbs.core.domain;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "exchange_rates")
public class ExchangeRate extends BaseEntity {

    @Column(name = "rate", nullable = false, precision = 14, scale = 4)
    private BigDecimal rate;

    @ManyToOne
    @JoinColumn(name = "from_currency_id", nullable = false)
    private Currency fromCurrency;

    @ManyToOne
    @JoinColumn(name = "to_currency_id", nullable = false)
    private Currency toCurrency;

    @Column(name = "date", nullable = false)
    private LocalDate date;

}
