package com.opencbs.bonds.services;

import com.opencbs.bonds.domain.Bond;
import com.opencbs.core.domain.GlobalSettings;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.repositories.GlobalSettingsRepository;
import com.opencbs.core.services.CurrencyService;
import com.opencbs.core.services.GlobalSettingsService;
import org.springframework.stereotype.Service;

import javax.script.ScriptEngine;
import javax.script.ScriptException;

@Service
public class BondGlobalSettingService extends GlobalSettingsService{

    public BondGlobalSettingService(GlobalSettingsRepository globalSettingsRepository,
                                    CurrencyService currencyService) {
        super(globalSettingsRepository, currencyService);
    }

    public String generateBondCode(Bond bond) throws ScriptException, ResourceNotFoundException {
        ScriptEngine engine = this.getJsEngine();
        GlobalSettings globalSettings = this.findOne("BONDS_CODE_PATTERN")
                .orElseThrow(() -> new ResourceNotFoundException("Global setting: Pattern for generating bond code is not found."));
        engine.put("bonds_id", String.format("%05d", bond.getId()));
        engine.put("bonds", bond);
        return this.eval(engine, globalSettings.getValue());
    }
}
