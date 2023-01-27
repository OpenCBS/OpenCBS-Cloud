package com.opencbs.borrowings.services.repayments;

import com.opencbs.core.domain.RepaymentTypes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class BorrowingRepaymentServiceFactory {

    @Autowired
    ApplicationContext context;

    public BorrowingRepaymentService getBorrowingRepaymentService(RepaymentTypes repaymentTypes) {
        Map<String, BorrowingRepaymentService> services = this.context.getBeansOfType(BorrowingRepaymentService.class);
        String key = repaymentTypes.toString().toLowerCase().replace("_", "") + "service";
        return services.entrySet()
                .stream()
                .filter(x -> x.getKey().toLowerCase().endsWith(key))
                .map(Map.Entry::getValue)
                .findFirst()
                .orElse(null);
    }
}
