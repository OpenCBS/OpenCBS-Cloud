package com.opencbs.core.controllers;

import com.opencbs.core.domain.Currency;
import com.opencbs.core.services.CurrencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@RestController
@RequestMapping(value = "/api/currencies")
@SuppressWarnings("unused")
public class CurrencyController extends BaseController {
    private final CurrencyService currencyService;

    @Autowired
    public CurrencyController(CurrencyService currencyService) {
        this.currencyService = currencyService;
    }

    @RequestMapping(method = GET)
    public List<Currency> get() {
        return this.currencyService.findAll();
    }

    @RequestMapping(value = "/lookup", method = GET)
    public Page<Currency> getLookup(Pageable pageable, @RequestParam(value = "search",required = false) String searchString) {
        return this.currencyService.findAll(pageable, searchString);
    }
}
