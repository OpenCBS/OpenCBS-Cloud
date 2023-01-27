package com.opencbs.borrowings.services;

import com.opencbs.core.domain.GlobalSettings;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.repositories.GlobalSettingsRepository;
import com.opencbs.core.services.CurrencyService;
import com.opencbs.core.services.GlobalSettingsService;
import com.opencbs.borrowings.domain.Borrowing;
import org.springframework.stereotype.Service;

import javax.script.ScriptEngine;
import javax.script.ScriptException;

@Service
public class BorrowingGlobalSettingsService extends GlobalSettingsService {

    public BorrowingGlobalSettingsService(GlobalSettingsRepository globalSettingsRepository,
                                          CurrencyService currencyService) {
        super(globalSettingsRepository, currencyService);
    }

    public String generateBorrowingCode(Borrowing borrowing) throws ScriptException, ResourceNotFoundException {
        ScriptEngine engine = this.getJsEngine();
        GlobalSettings globalSettings = this.findOne("BORROWING_CODE_PATTERN")
                .orElseThrow(() -> new ResourceNotFoundException("Global setting: Pattern for generating borrowing code is not found."));
        engine.put("borrowing_id", String.format("%05d", borrowing.getId()));
        engine.put("borrowing", borrowing);
        return this.eval(engine, globalSettings.getValue());
    }
}
