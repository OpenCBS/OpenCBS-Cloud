package com.opencbs.core.services;

import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.GlobalSettings;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.repositories.GlobalSettingsRepository;
import lombok.NonNull;
import org.springframework.stereotype.Service;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.util.List;
import java.util.Optional;

@Service
public class GlobalSettingsService {

    private final GlobalSettingsRepository globalSettingsRepository;
    private final CurrencyService currencyService;

    public GlobalSettingsService(GlobalSettingsRepository globalSettingsRepository,
                                 CurrencyService currencyService) {
        this.globalSettingsRepository = globalSettingsRepository;
        this.currencyService = currencyService;
    }

    public List<GlobalSettings> findAll() {
        return this.globalSettingsRepository.findAll();
    }

    public Optional<GlobalSettings> findOne(String name) {
        return Optional.ofNullable(this.globalSettingsRepository.findOne(name));
    }

    public GlobalSettings update(GlobalSettings globalSettings) {
        return this.globalSettingsRepository.save(globalSettings);
    }

    public boolean useMakerAndChecker() {
        return this.findOne("USE_MAKER_AND_CHECKER")
                .get()
                .getValue()
                .equals("true");
    }

    public Optional<Currency> getDefaultCurrency() throws ResourceNotFoundException {
        Optional<GlobalSettings> globalSettings = this.findOne("PIVOT_CURRENCY_ID");
        if (!globalSettings.isPresent())
            throw new ResourceNotFoundException("Global settings for default currency not found.");
        Optional<Currency> defaultCurrency = currencyService.findOne(Long.valueOf(globalSettings.get().getValue()));
        if (!defaultCurrency.isPresent())
            throw new ResourceNotFoundException("Default currency not found.");
        return defaultCurrency;
    }

    protected ScriptEngine getJsEngine() {
        ScriptEngineManager factory = new ScriptEngineManager();
        return factory.getEngineByName("nashorn");
    }

    protected String eval(ScriptEngine engine, String script) throws ScriptException {
        return engine.eval(script).toString();
    }

    public String getSettingValue(@NonNull String settingName) {
        GlobalSettings globalSettings = globalSettingsRepository.findOne(settingName);
        if (globalSettings==null){
            throw new ResourceNotFoundException(String.format("Not found setting with name: %s", settingName));
        }

        return globalSettings.getValue();
    }
}
