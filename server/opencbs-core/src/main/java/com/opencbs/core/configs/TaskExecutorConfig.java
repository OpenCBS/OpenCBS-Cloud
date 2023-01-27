package com.opencbs.core.configs;

import com.opencbs.core.configs.properties.TaskExecutorProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
@RequiredArgsConstructor
public class TaskExecutorConfig {

    private final TaskExecutorProperties properties;


    @Bean
    public ThreadPoolTaskExecutor threadPoolTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(properties.getMinPoolSize());
        executor.setMaxPoolSize(properties.getMaxPoolSize());
        executor.setThreadNamePrefix("default_task_executor_thread");
        executor.initialize();

        return executor;
    }
}
