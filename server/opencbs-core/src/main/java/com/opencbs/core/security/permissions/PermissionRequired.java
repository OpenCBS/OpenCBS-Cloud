package com.opencbs.core.security.permissions;

import com.opencbs.core.domain.enums.ModuleType;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface PermissionRequired {

    ModuleType moduleType();

    String name();

    String description();

}
