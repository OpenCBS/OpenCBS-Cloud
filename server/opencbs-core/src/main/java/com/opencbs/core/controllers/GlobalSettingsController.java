package com.opencbs.core.controllers;

import com.opencbs.core.domain.GlobalSettings;
import com.opencbs.core.dto.GlobalSettingsDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.mappers.GlobalSettingsMapper;
import com.opencbs.core.services.GlobalSettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@RestController
@RequestMapping(value = "/api/global-settings")
public class GlobalSettingsController extends BaseController {

    private final GlobalSettingsService globalSettingsService;
    private final GlobalSettingsMapper globalSettingsMapper;

    @Autowired
    public GlobalSettingsController(GlobalSettingsService globalSettingsService,
                                    GlobalSettingsMapper globalSettingsMapper) {
        this.globalSettingsService = globalSettingsService;
        this.globalSettingsMapper = globalSettingsMapper;
    }

    @RequestMapping(method = GET)
    public List<GlobalSettingsDto> get() {
        return this.globalSettingsService.findAll()
                .stream().map(this.globalSettingsMapper::mapToDto)
                .collect(Collectors.toList());
    }


    @RequestMapping(value = "/{name}", method = GET)
    public GlobalSettingsDto get(@PathVariable String name) {
        GlobalSettings globalSettings = this.globalSettingsService
                .findOne(name)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Global setting not found (name=%s).", name)));
        return this.globalSettingsMapper.mapToDto(globalSettings);
    }

}
