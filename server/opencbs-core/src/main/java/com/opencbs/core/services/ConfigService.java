package com.opencbs.core.services;

import com.opencbs.core.configs.properties.RabbitProperties;
import com.opencbs.core.dto.messenger.RabbitCredentials;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ConfigService {

    private final RabbitProperties rabbitProperties;

    @Autowired
    public ConfigService(RabbitProperties rabbitProperties) {
        this.rabbitProperties = rabbitProperties;
    }

    public RabbitCredentials getRabbitProperties() {
        return RabbitCredentials.builder()
                .host(rabbitProperties.getFrontHost())
                .username(rabbitProperties.getUsername())
                .password(rabbitProperties.getPassword())
                .virtualHost(rabbitProperties.getVirtualHost())
                .directExchange(rabbitProperties.getDirectExchange())
                .fanoutExchange(rabbitProperties.getFanoutExchange())
                .build();
    }
}
