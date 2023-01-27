package com.opencbs.termdeposite.services;

import com.opencbs.core.domain.GlobalSettings;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.repositories.GlobalSettingsRepository;
import com.opencbs.core.services.CurrencyService;
import com.opencbs.core.services.GlobalSettingsService;
import com.opencbs.termdeposite.annotaions.CustomTermDepositCodeGenerator;
import com.opencbs.termdeposite.domain.TermDeposit;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

import javax.script.ScriptEngine;
import javax.script.ScriptException;

@Service
@ConditionalOnMissingBean(annotation = CustomTermDepositCodeGenerator.class)
public class TermDepositGlobalSettingService extends GlobalSettingsService implements TermDepositCodeGenerator {

    public TermDepositGlobalSettingService(GlobalSettingsRepository globalSettingsRepository,
                                            CurrencyService currencyService) {
        super(globalSettingsRepository, currencyService);
    }

    @Override
    public String generateCode(TermDeposit termDeposit) throws ScriptException, ResourceNotFoundException {
        ScriptEngine engine = this.getJsEngine();
        GlobalSettings globalSettings = this.findOne("TERM_DEPOSIT_CODE_PATTERN")
                .orElseThrow(() -> new ResourceNotFoundException("Global setting: Pattern for generating term code is not found."));
        engine.put("term_deposit_id", String.format("%05d", termDeposit.getId()));
        return this.eval(engine, globalSettings.getValue());
    }
}