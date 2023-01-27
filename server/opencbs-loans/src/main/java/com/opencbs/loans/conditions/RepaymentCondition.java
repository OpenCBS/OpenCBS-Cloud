package com.opencbs.loans.conditions;

import com.opencbs.loans.annotations.repayment.CustomLoanRepaymentService;
import org.reflections.Reflections;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Condition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.core.annotation.Order;
import org.springframework.core.type.AnnotatedTypeMetadata;

@Order
@ConditionalOnMissingBean
public class RepaymentCondition implements Condition {

    @Override
    public boolean matches(ConditionContext conditionContext, AnnotatedTypeMetadata annotatedTypeMetadata) {
        Reflections reflections = new Reflections("com.opencbs");
        return reflections.getTypesAnnotatedWith(CustomLoanRepaymentService.class).isEmpty();
    }
}