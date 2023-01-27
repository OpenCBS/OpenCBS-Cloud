package com.opencbs.loans.services.repayment.repaymenttype;

import com.opencbs.core.domain.RepaymentTypes;
import com.opencbs.loans.annotations.repayment.CustomLoanRepaymentTypeService;
import com.opencbs.loans.dto.RepaymentTypeDto;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@ConditionalOnMissingBean(annotation = CustomLoanRepaymentTypeService.class)
public class RepaymentTypesService implements RepaymentTypeService {

    @Override
    public List<RepaymentTypeDto> getRepaymentTypes() {
        return Arrays.asList(
                new RepaymentTypeDto(1, RepaymentTypes.NORMAL_REPAYMENT),
                new RepaymentTypeDto(2, RepaymentTypes.EARLY_TOTAL_REPAYMENT)
        );
    }
}
