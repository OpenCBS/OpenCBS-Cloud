package com.opencbs.core.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.dto.ScheduleParamsDto;
import com.opencbs.core.helpers.DateHelper;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;

@Validator
public class ScheduleParamsDtoValidator {

    public void validate(ScheduleParamsDto params) throws Exception {

        Assert.notNull(params.getScheduleType(), "Schedule type is required.");
        Assert.isTrue(!StringUtils.isEmpty(params.getDisbursementDate()), "Disbursement date is required.");
        Assert.isTrue(DateHelper.isValidDate(params.getDisbursementDate()), "Disbursement date is not a valid date.");
        Assert.isTrue(!StringUtils.isEmpty(params.getPreferredRepaymentDate()), "Preferred repayment date is required.");
        Assert.isTrue(DateHelper.isValidDate(params.getPreferredRepaymentDate()), "Preferred repayment date is not a valid date.");
        Assert.notNull(params.getAmount(), "Amount is required.");
        Assert.notNull(params.getInterestRate(), "Interest rate is required.");
        Assert.notNull(params.getMaturity(), "Maturity is required.");
    }
}
