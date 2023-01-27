package com.opencbs.savings.services;

import com.opencbs.core.domain.GlobalSettings;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.repositories.GlobalSettingsRepository;
import com.opencbs.core.services.CurrencyService;
import com.opencbs.core.services.GlobalSettingsService;
import com.opencbs.savings.annotations.CustomSavingCodeGenerator;
import com.opencbs.savings.domain.Saving;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

import javax.script.ScriptEngine;
import javax.script.ScriptException;

@Service
@ConditionalOnMissingBean(annotation = CustomSavingCodeGenerator.class)
public class SavingGlobalSettingService extends GlobalSettingsService implements SavingCodeGenerator {

    public SavingGlobalSettingService(GlobalSettingsRepository globalSettingsRepository,
                                      CurrencyService currencyService) {
        super(globalSettingsRepository, currencyService);
    }

    @Override
    public String generateCode(Saving saving) throws ScriptException, ResourceNotFoundException {
        ScriptEngine engine = this.getJsEngine();
        GlobalSettings globalSettings = this.findOne("SAVING_CODE_PATTERN")
                .orElseThrow(() -> new ResourceNotFoundException("Global setting: Pattern for generating saving code is not found."));
        engine.put("saving_id", String.format("%05d", saving.getId()));
        engine.put("saving", saving);
        return this.eval(engine, globalSettings.getValue());
    }
}
