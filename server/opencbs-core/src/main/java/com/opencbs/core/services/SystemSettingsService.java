package com.opencbs.core.services;

import com.opencbs.core.domain.SystemSettings;
import com.opencbs.core.domain.enums.SystemSettingsName;
import com.opencbs.core.dto.customfields.CustomFieldValueDto;
import com.opencbs.core.repositories.SystemSettingsRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SystemSettingsService {

    private final SystemSettingsRepository systemSettingsRepository;

    public SystemSettingsService(SystemSettingsRepository systemSettingsRepository) {
        this.systemSettingsRepository = systemSettingsRepository;
    }

    public List<SystemSettings> findAll() {
        return this.systemSettingsRepository.findAll();
    }

    public Optional<SystemSettings> findById(Long id) {
        return Optional.ofNullable(this.systemSettingsRepository.findOne(id));
    }

    public Optional<SystemSettings> findByName(SystemSettingsName name) {
        return Optional.ofNullable(this.systemSettingsRepository.findByName(name));
    }

    public SystemSettings update(SystemSettings systemSettings, CustomFieldValueDto dto) {
        systemSettings.setValue(dto.getValue().toString());
        this.systemSettingsRepository.save(systemSettings);
        return systemSettings;
    }

    public String getValueByName(SystemSettingsName systemSettingName) {
        return systemSettingsRepository.findByName(systemSettingName).getValue();
    }

}
