package com.opencbs.loans.services.repayment.repaymenttype;

import com.opencbs.loans.dto.RepaymentTypeDto;

import java.util.List;

public interface RepaymentTypeService {

    List<RepaymentTypeDto> getRepaymentTypes();
}
