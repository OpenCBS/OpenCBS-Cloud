package com.opencbs.core.domain.schedule;

import com.opencbs.core.domain.enums.ScheduleBasedType;
import com.opencbs.core.services.schedulegenerators.ScheduleGeneratorTypes;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.util.CollectionUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ScheduleParams {

    private BigDecimal amount;
    private LocalDate disbursementDate;
    private LocalDate preferredRepaymentDate;
    private Integer maturity;
    private Integer gracePeriod;
    private ScheduleGeneratorTypes scheduleType;
    private BigDecimal interestRate;
    private LocalDate maturityDate;
    private ScheduleBasedType scheduleBasedType;
    private Map<Long, BigDecimal> installmentPrincipals;

    public boolean isUseCustomInstallmentPrincipals() {
        return !CollectionUtils.isEmpty(installmentPrincipals);
    }
}
