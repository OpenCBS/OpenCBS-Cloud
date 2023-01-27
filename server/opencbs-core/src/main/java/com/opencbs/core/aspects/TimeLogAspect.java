package com.opencbs.core.aspects;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class TimeLogAspect {
    @Around("@annotation(com.opencbs.core.annotations.TimeLog)")
    public Object time(final ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        Object value = proceedingJoinPoint.proceed();
        long duration = System.currentTimeMillis() - start;

        log.debug("{}.{} completed in {} ms",
                proceedingJoinPoint.getSignature().getDeclaringType().getSimpleName(),
                proceedingJoinPoint.getSignature().getName(),
                duration);

        return value;
    }
}
