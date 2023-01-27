package com.opencbs.core.services;

import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.ExchangeRate;
import com.opencbs.core.repositories.ExchangeRateRepository;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import org.w3c.dom.Element;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Optional;

public abstract class AbstractExchangeRateService {

    protected final CurrencyService currencyService;
    protected final ExchangeRateRepository exchangeRateRepository;
    protected final HolidayService holidayService;

    public AbstractExchangeRateService(CurrencyService currencyService,
                                       ExchangeRateRepository exchangeRateRepository,
                                       HolidayService holidayService) {
        this.currencyService = currencyService;
        this.exchangeRateRepository = exchangeRateRepository;
        this.holidayService = holidayService;
    }

    @Transactional
    public abstract void getCurrencies() throws Exception;

    protected void createRate(Element element, LocalDate date, Currency euro) {
        ExchangeRate exchangeRate = new ExchangeRate();
        exchangeRate.setFromCurrency(euro);
        exchangeRate.setDate(date);
        Optional<Currency> optionalCurrency = this.currencyService.getCurrencyByName(element.getAttribute("currency"));
        if (!optionalCurrency.isPresent()) {
            return;
        }

        BigDecimal rate = new BigDecimal(element.getAttribute("rate"));
        exchangeRate.setRate(rate);
        exchangeRate.setToCurrency(optionalCurrency.get());

        Optional<ExchangeRate> alreadyExistCurrencyRate = this.exchangeRateRepository.findByDateAndToCurrencyId(date, optionalCurrency.get().getId());
        if(!alreadyExistCurrencyRate.isPresent()) {
            this.exchangeRateRepository.save(exchangeRate);
        }
    }

    public ExchangeRate getByDateAndCurrencyId(LocalDate date, Long currencyId) {
        return this.exchangeRateRepository.findByDateAndToCurrencyId(date, currencyId)
                .orElseThrow(() -> new RuntimeException(String.format("There is no exchange rate on date %s.", date.toString())));
    }

    public ExchangeRate getExchangeRateByCurrenciesAndDate(Currency fromCurrency, Currency toCurrency, LocalDate date) {
        return this.exchangeRateRepository.findByFromCurrencyIdAndToCurrencyIdAndDate(fromCurrency.getId(), toCurrency.getId(), date)
                .orElseThrow(() ->
                new RuntimeException(String.format("There is no exchange rate on this currencies pair (%s - %s), or on this date %s", fromCurrency.getName(), toCurrency.getName(), date.toString())));
    }

    protected ExchangeRate create(ExchangeRate exchangeRate) {
        return this.exchangeRateRepository.save(exchangeRate);
    }

    public Page<ExchangeRate> getExchangeRates(@NonNull LocalDate fromDate, @NonNull LocalDate toDate, @NonNull Pageable pageable){
        return exchangeRateRepository.findByDateBetween(fromDate, toDate, pageable);
    }

    public BigDecimal getConvertedRate(Currency fromCurrency, Currency toCurrency, BigDecimal amount, LocalDateTime dateTime, Boolean isPivot){
        if (fromCurrency.equals(toCurrency)){
            return amount;
        }
        LocalTime timeToCompare = LocalTime.of(16, 0, 0);
        LocalDateTime CETDateTime = dateTime.atZone(ZoneId.of("Asia/Bishkek")).withZoneSameInstant(ZoneId.of("CET")).toLocalDateTime(); //converted to CET
        if (CETDateTime.toLocalTime().isBefore(timeToCompare)) {
            dateTime = dateTime.minusDays(1);
        }
        LocalDate lastWorkDay = this.holidayService.getLastWorkDay(dateTime.toLocalDate());
        BigDecimal actualRate = this.getExchangeRateByCurrenciesAndDate(fromCurrency, toCurrency, lastWorkDay).getRate();
        if (isPivot) {
            return amount.multiply(actualRate).setScale(2, RoundingMode.HALF_UP);
        }
        else {
            return amount.divide(actualRate, 2, RoundingMode.HALF_UP);
        }
    }
}
