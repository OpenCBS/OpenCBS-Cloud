package com.opencbs.core.configs;

public interface FlywayConfig {
    String getSchema();

    String getTable();

    String getLocation();

    boolean getBaselineOnMigrate();
}
