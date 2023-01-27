package com.opencbs.core.controllers;

import com.opencbs.core.domain.SystemSettings;
import com.opencbs.core.dto.customfields.CustomFieldValueDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.mappers.SystemSettingsMapper;
import com.opencbs.core.services.SystemSettingsService;
import com.opencbs.core.validators.SystemSettingsValidator;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/system-settings")
public class SystemSettingsController {

    private final SystemSettingsService systemSettingsService;
    private final SystemSettingsMapper systemSettingsMapper;
    private final SystemSettingsValidator systemSettingsValidator;

    public SystemSettingsController(SystemSettingsService systemSettingsService,
                                    SystemSettingsMapper systemSettingsMapper,
                                    SystemSettingsValidator systemSettingsValidator) {
        this.systemSettingsService = systemSettingsService;
        this.systemSettingsMapper = systemSettingsMapper;
        this.systemSettingsValidator = systemSettingsValidator;
    }

    @GetMapping
    public List<CustomFieldValueDto> getAll() {
        return this.systemSettingsService.findAll()
                .stream()
                .sorted(Comparator.comparing(SystemSettings::getId))
                .map(this.systemSettingsMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @PutMapping
    public List<CustomFieldValueDto> edit(@RequestBody List<CustomFieldValueDto> dto) {
        List<CustomFieldValueDto> result = new ArrayList<>();
        for (CustomFieldValueDto systemSettingsDto : dto) {
            SystemSettings systemSetting = this.systemSettingsService.findById(systemSettingsDto.getCustomField().getId())
                    .orElseThrow(() -> new ResourceNotFoundException(String.format("System setting not found (ID=%d).", systemSettingsDto.getCustomField().getId())));
            this.systemSettingsValidator.validateOnEdit(systemSettingsDto);
            result.add(this.systemSettingsMapper.mapToDto(systemSettingsService.update(systemSetting, systemSettingsDto)));

        }
        return result;
    }

}
