package com.opencbs.bonds.services.repayment;

import com.opencbs.core.domain.RepaymentTypes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class BondRepaymentServiceFactory {

    @Autowired
    ApplicationContext context;

    private Map<RepaymentTypes, BondRepaymentService> cacheBondServices;

    @PostConstruct
    public void init(){
       cacheBondServices = this.context.getBeansOfType(BondRepaymentService.class)
                .entrySet()
                .stream()
                .collect(Collectors.toMap(x -> x.getValue().getType(), Map.Entry::getValue));
    }

    public BondRepaymentService getBondRepaymentService(RepaymentTypes repaymentTypes) {
        BondRepaymentService bondRepaymentService = cacheBondServices.get(repaymentTypes);

        if(bondRepaymentService == null){
            throw new RuntimeException(String.format("The bound repayment service is not found (TYPE = %s)", repaymentTypes));
        }

        return bondRepaymentService;
    }
}
