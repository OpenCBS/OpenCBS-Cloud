package com.opencbs.loans.annotations.repayment;

import com.opencbs.loans.conditions.RepaymentCondition;
import org.springframework.context.annotation.Conditional;
import org.springframework.stereotype.Service;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Service
@Conditional(RepaymentCondition.class)
public @interface DefaultRepaymentService {
    String value() default "";
}
