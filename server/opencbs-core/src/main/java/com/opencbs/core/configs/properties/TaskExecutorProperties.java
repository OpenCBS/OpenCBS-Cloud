package com.opencbs.core.configs.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data

@Component
@ConfigurationProperties(ignoreUnknownFields = false, prefix = "task-executor")
public class TaskExecutorProperties {

    private Integer minPoolSize;
    private Integer maxPoolSize;
}
