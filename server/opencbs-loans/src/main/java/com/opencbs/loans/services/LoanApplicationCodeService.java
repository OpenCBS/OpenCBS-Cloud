package com.opencbs.loans.services;

import com.opencbs.core.domain.GlobalSettings;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.repositories.GlobalSettingsRepository;
import com.opencbs.core.services.CurrencyService;
import com.opencbs.core.services.GlobalSettingsService;
import com.opencbs.loans.annotations.CustomLoanApplicationCodeGenerator;
import com.opencbs.loans.domain.LoanApplication;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

import javax.script.ScriptEngine;
import javax.script.ScriptException;

@Service
@ConditionalOnMissingBean(annotation = CustomLoanApplicationCodeGenerator.class)
public class LoanApplicationCodeService extends GlobalSettingsService implements LoanApplicationCodeGenerator {

    public LoanApplicationCodeService(GlobalSettingsRepository globalSettingsRepository, CurrencyService currencyService) {
        super(globalSettingsRepository, currencyService);
    }

    @Override
    public String generateCode(LoanApplication loanApplication) throws ScriptException {
        ScriptEngine engine = this.getJsEngine();
        GlobalSettings globalSettings = this.findOne("LOAN_APPLICATION_CODE_PATTERN")
                .orElseThrow(() -> new ResourceNotFoundException("Global setting: Pattern for generating loan application code not found."));
        engine.put("application", loanApplication);
        engine.put("application_id", String.format("%05d", loanApplication.getId()));
        engine.put("profile_id", String.format("%05d", loanApplication.getProfile().getId()));
        return this.eval(engine, globalSettings.getValue());
    }
}
