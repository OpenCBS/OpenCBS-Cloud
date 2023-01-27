package com.opencbs.core.controllers;

import com.opencbs.core.dto.messenger.RabbitCredentials;
import com.opencbs.core.services.ConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/configurations")
public class ConfigController extends BaseController {

    private final ConfigService configService;

    @Autowired
    public ConfigController(ConfigService configService) {
        this.configService = configService;
    }

    @GetMapping(path = "rabbit-credential")
    public RabbitCredentials getAmpqCredential() {
        return configService.getRabbitProperties();
    }

}