package com.opencbs.core.configs;

import lombok.extern.slf4j.Slf4j;
import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Configuration
public class CoreFlywayMigrationStrategy implements FlywayMigrationStrategy {

    @Autowired
    ApplicationContext context;

    @Override
    public void migrate(Flyway flyway) {
        log.info("Start migrate OpenCBS cloud database");

        flyway.setSchemas("public");
        flyway.setTable("schema_version_core");
        flyway.setLocations("classpath:db/migration/core");
        flyway.migrate();

        for (FlywayConfig config : this.getConfigs()) {
            log.info(String.format("Start migrate to %s", config.getTable()));
            flyway.setSchemas(config.getSchema());
            flyway.setTable(config.getTable());
            flyway.setLocations(config.getLocation());
            flyway.setBaselineOnMigrate(config.getBaselineOnMigrate());
            flyway.migrate();
        }
    }

    private List<FlywayConfig> getConfigs() {
        return this.context.getBeansOfType(FlywayConfig.class)
                .entrySet()
                .stream()
                .map(x -> x.getValue())
                .collect(Collectors.toList());
    }
}
