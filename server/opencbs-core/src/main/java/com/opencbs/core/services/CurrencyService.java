package com.opencbs.core.services;

import com.opencbs.core.domain.Currency;
import com.opencbs.core.repositories.CurrencyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CurrencyService {

    private final CurrencyRepository currencyRepository;

    @Autowired
    public CurrencyService(CurrencyRepository currencyRepository) {
        this.currencyRepository = currencyRepository;
    }

    public List<Currency> findAll() {
        return this.currencyRepository.findAllByIsMainIsTrue()
                .stream()
                .sorted(Comparator.comparing(Currency::getName))
                .collect(Collectors.toList());
    }

    public Page<Currency> findAll(Pageable pageable, String searchString) {
        if(!StringUtils.isEmpty(searchString)){
            return this.currencyRepository.findAllByNameContainsIgnoreCase(pageable, searchString);
        }
        return this.currencyRepository.findAll(pageable);
    }

    public Optional<Currency> findOne(long id) {
        return Optional.of(this.currencyRepository.findOne(id));
    }

    @Transactional
    public Currency create(Currency currency) {
        return this.currencyRepository.save(currency);
    }

    public Optional<Currency> getCurrencyByName(String name) {
        return Optional.ofNullable(this.currencyRepository.getByName(name));
    }
}