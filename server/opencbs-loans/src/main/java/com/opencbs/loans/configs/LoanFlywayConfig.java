package com.opencbs.loans.configs;

import com.opencbs.core.configs.FlywayConfig;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LoanFlywayConfig implements FlywayConfig {
    @Override
    public String getSchema() {
        return "public";
    }

    @Override
    public String getTable() {
        return "schema_version_loans";
    }

    @Override
    public String getLocation() {
        return "db/migration/loans";
    }

    @Override
    public boolean getBaselineOnMigrate() {
        return true;
    }
}
