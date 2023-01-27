package com.opencbs.loans.services;

import com.opencbs.core.domain.GlobalSettings;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.repositories.GlobalSettingsRepository;
import com.opencbs.core.services.CurrencyService;
import com.opencbs.core.services.GlobalSettingsService;
import com.opencbs.loans.annotations.CustomLoanCodeGenerator;
import com.opencbs.loans.domain.Loan;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

import javax.script.ScriptEngine;
import javax.script.ScriptException;

@Service
@ConditionalOnMissingBean(annotation = CustomLoanCodeGenerator.class)
public class LoanGlobalSettingsService extends GlobalSettingsService implements LoanCodeGenerator {

    public LoanGlobalSettingsService(GlobalSettingsRepository globalSettingsRepository, CurrencyService currencyService) {
        super(globalSettingsRepository, currencyService);
    }

    @Override
    public String generateCode(Loan loan) throws ScriptException, ResourceNotFoundException {
        ScriptEngine engine = this.getJsEngine();
        GlobalSettings globalSettings = this.findOne("LOAN_CODE_PATTERN")
                .orElseThrow(() -> new ResourceNotFoundException("Global setting: Pattern for generating loan code not found."));
        engine.put("loan_id", String.format("%05d", loan.getId()));
        engine.put("loan", loan);
        return this.eval(engine, globalSettings.getValue());
    }
}
