package com.opencbs.core.repositories;

import com.opencbs.core.domain.Currency;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CurrencyRepository extends Repository<Currency> {

    Currency getByName(String name);
    Page<Currency> findAllByNameContainsIgnoreCase(Pageable pageable, String searchString);
    List<Currency> findAllByIsMainIsTrue();
}
