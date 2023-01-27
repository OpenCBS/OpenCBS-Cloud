package com.opencbs.core.configs.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(ignoreUnknownFields = false, prefix = "account-balance-calculation")
public class AccountBalanceCalculationProperties {

    private String exchange;
    private String queue;
    private String routingKey;
}
