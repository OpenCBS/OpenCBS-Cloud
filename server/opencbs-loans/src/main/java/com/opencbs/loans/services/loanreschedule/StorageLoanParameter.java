package com.opencbs.loans.services.loanreschedule;

import com.opencbs.core.domain.json.ExtraJson;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class StorageLoanParameter {
    private BigDecimal interestRate;
    private int  gracePeriod;
    private LocalDate maturityDate;
    private int  maturity;

    public ExtraJson toExtraJson() {
        ExtraJson extraJson = new ExtraJson();
        extraJson.put("InterestRate", interestRate );
        extraJson.put("GracePeriod", gracePeriod);
        if (maturityDate!=null) {
            extraJson.put("MaturityDate", maturityDate.toEpochDay());
        }
        extraJson.put("Maturity", maturity);
        return extraJson;
    }

    static public StorageLoanParameter of(ExtraJson extraJson) {
        final StorageLoanParameter storageLoanParameter = StorageLoanParameter.builder()
                .interestRate(BigDecimal.valueOf(Double.valueOf(extraJson.get("InterestRate").toString())))
                .gracePeriod(Integer.parseInt(extraJson.get("GracePeriod").toString()))
                .maturity(Integer.valueOf(extraJson.get("Maturity").toString()))
                .build();
        if (extraJson.get("MaturityDate")!=null) {
            storageLoanParameter.setMaturityDate(LocalDate.ofEpochDay(Long.valueOf(extraJson.get("MaturityDate").toString())));
        }

        return storageLoanParameter;
    }
}
