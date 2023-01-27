package com.opencbs.core.annotations.handlers;

import com.opencbs.core.conditions.RequestRepaymentHandlerCondition;
import org.springframework.context.annotation.Conditional;
import org.springframework.stereotype.Service;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Service
@Conditional(RequestRepaymentHandlerCondition.class)
public @interface DefaultLoanRepaymentHandlerService {
    String value() default "";
}
