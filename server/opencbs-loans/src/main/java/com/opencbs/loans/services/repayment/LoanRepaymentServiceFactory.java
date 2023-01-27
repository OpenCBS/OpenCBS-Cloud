package com.opencbs.loans.services.repayment;

import com.opencbs.core.domain.RepaymentTypes;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

@Component
public class LoanRepaymentServiceFactory {

    @Autowired
    ApplicationContext context;

    public LoanRepaymentService getLoanRepaymentService(RepaymentTypes repaymentTypes) throws ResourceNotFoundException {
        if (repaymentTypes == null) {
            repaymentTypes = RepaymentTypes.NORMAL_REPAYMENT;
        }

        LoanRepaymentService service = context.getBean(repaymentTypes.toString(), LoanRepaymentService.class);
        if (service != null) {
            return service;
        }

        throw new ResourceNotFoundException("Repayment Implementations not found!");
    }
}
