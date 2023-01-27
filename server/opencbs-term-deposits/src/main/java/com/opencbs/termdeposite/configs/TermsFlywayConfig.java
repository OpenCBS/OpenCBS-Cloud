package com.opencbs.termdeposite.configs;

import com.opencbs.core.configs.FlywayConfig;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TermsFlywayConfig implements FlywayConfig {
    @Override
    public String getSchema() {
        return "public";
    }

    @Override
    public String getTable() {
        return "schema_version_terms";
    }

    @Override
    public String getLocation() {
        return "db/migration/termdeposits";
    }

    @Override
    public boolean getBaselineOnMigrate() {
        return true;
    }
}