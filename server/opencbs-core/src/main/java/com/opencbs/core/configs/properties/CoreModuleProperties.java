package com.opencbs.core.configs.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(ignoreUnknownFields = false, prefix = "opencbs.core")
public class CoreModuleProperties {
    private boolean enableInterestAccrual = false;
    private boolean enablePenaltyAccrual= false;
    private boolean enableAutoRepayment= false;

    public boolean isEnableInterestAccrual() {
        return enableInterestAccrual;
    }

    public void setEnableInterestAccrual(boolean enableInterestAccrual) {
        this.enableInterestAccrual = enableInterestAccrual;
    }

    public boolean isEnablePenaltyAccrual() {
        return enablePenaltyAccrual;
    }

    public void setEnablePenaltyAccrual(boolean enablePenaltyAccrual) {
        this.enablePenaltyAccrual = enablePenaltyAccrual;
    }

    public boolean isEnableAutoRepayment() {
        return enableAutoRepayment;
    }

    public void setEnableAutoRepayment(boolean enableAutoRepayment) {
        this.enableAutoRepayment = enableAutoRepayment;
    }
}
