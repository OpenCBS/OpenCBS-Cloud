package com.opencbs.core.conditions;

import com.opencbs.core.annotations.handlers.CustomLoanRepaymentHandlerService;
import org.reflections.Reflections;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Condition;
import org.springframework.context.annotation.ConditionContext;
import org.springframework.core.annotation.Order;
import org.springframework.core.type.AnnotatedTypeMetadata;

@Order
@ConditionalOnMissingBean
public class RequestRepaymentHandlerCondition implements Condition {

    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        Reflections reflections = new Reflections("com.opencbs");
        return reflections.getTypesAnnotatedWith(CustomLoanRepaymentHandlerService.class).isEmpty();
    }
}
