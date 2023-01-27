package com.opencbs.core.configs.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Data
@Component
@ConfigurationProperties(ignoreUnknownFields = false, prefix = "day-closure")
public class DayClosureProperties {

    private Boolean autoStart;
    private String autoStartTime;
    private List<String> errorToEmails;
}
