package com.opencbs.borrowings.configurations;

import com.opencbs.core.configs.FlywayConfig;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BorrowingFlywayConfig implements FlywayConfig {
    @Override
    public String getSchema() {
        return "public";
    }

    @Override
    public String getTable() {
        return "schema_version_borrowings";
    }

    @Override
    public String getLocation() {
        return "db/migration/borrowings";
    }

    @Override
    public boolean getBaselineOnMigrate() {
        return true;
    }
}
