package com.opencbs.core.security.permissions;

import com.opencbs.core.domain.User;
import com.opencbs.core.helpers.UserHelper;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;

@Aspect
@Component
public class PermissionAspect {

    @Before("@annotation(com.opencbs.core.security.permissions.PermissionRequired)")
    public void checkAllPermissions(JoinPoint joinPoint) {
        User currentUser = UserHelper.getCurrentUser();
        if(currentUser.getId() == 2 || currentUser.getIsSystemUser())
            return;

        Method method = MethodSignature.class.cast(joinPoint.getSignature()).getMethod();
        if (!currentUser.hasPermission(method.getAnnotation(PermissionRequired.class).name())) {
            throw new RuntimeException("You don't have permissions - " + method.getAnnotation(PermissionRequired.class).name());
        }
    }
}
