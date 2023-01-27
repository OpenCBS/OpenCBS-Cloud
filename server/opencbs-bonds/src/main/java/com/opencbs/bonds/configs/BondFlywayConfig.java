package com.opencbs.bonds.configs;

import com.opencbs.core.configs.FlywayConfig;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BondFlywayConfig implements FlywayConfig {

    @Override
    public String getSchema() {
        return "public";
    }

    @Override
    public String getTable() {
        return "schema_version_bonds";
    }

    @Override
    public String getLocation() {
        return "db/migration/bonds";
    }

    @Override
    public boolean getBaselineOnMigrate() {
        return true;
    }
}
