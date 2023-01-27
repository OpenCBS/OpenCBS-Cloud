package com.opencbs.core.repositories;

import com.opencbs.core.domain.ExchangeRate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.Optional;

public interface ExchangeRateRepository extends Repository<ExchangeRate> {

    Optional<ExchangeRate> findByDateAndToCurrencyId(LocalDate date, Long toCurrencyId);

    Optional<ExchangeRate> findByFromCurrencyIdAndToCurrencyIdAndDate(Long fromCurrencyId, Long toCurrencyId, LocalDate date);

    Page<ExchangeRate>  findByDateBetween(LocalDate fromDate, LocalDate toDate, Pageable pageable);
}
