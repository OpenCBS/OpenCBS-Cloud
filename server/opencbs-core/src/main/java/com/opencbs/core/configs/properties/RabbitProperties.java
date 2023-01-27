package com.opencbs.core.configs.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(ignoreUnknownFields = false, prefix = "spring.rabbitmq")
public class RabbitProperties {

    private String host;
    private String frontHost;
    private String port;
    private String username;
    private String password;
    private String virtualHost;
    private String directExchange;
    private String fanoutExchange;
}
