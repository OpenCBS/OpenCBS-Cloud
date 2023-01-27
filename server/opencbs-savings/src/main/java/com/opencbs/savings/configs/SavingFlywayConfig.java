package com.opencbs.savings.configs;

import com.opencbs.core.configs.FlywayConfig;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SavingFlywayConfig implements FlywayConfig {
    @Override
    public String getSchema() {
        return "public";
    }

    @Override
    public String getTable() {
        return "schema_version_savings";
    }

    @Override
    public String getLocation() {
        return "db/migration/savings";
    }

    @Override
    public boolean getBaselineOnMigrate() {
        return true;
    }
}