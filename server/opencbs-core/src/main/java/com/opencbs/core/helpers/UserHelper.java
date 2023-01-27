package com.opencbs.core.helpers;

import com.opencbs.core.domain.User;
import com.opencbs.core.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class UserHelper {

    private static UserService userService;
    private static Long SYSTEM_USER_ID = 1L;
    private static String permission = "PRIMARY_CREDIT_COMMITTEE_MEMBER";

    public static User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth==null) {
            return UserHelper.getSystemUser();
        }

        return (User) auth.getPrincipal();
    }

    public static User getSystemUser() {
        return userService.findById(SYSTEM_USER_ID).orElseThrow(() -> new RuntimeException("System user was not found"));
    }

    public static String getPrimaryCommitteePermission() {
        return permission;
    }

    @Autowired
    private void setUserService(UserService userServiceArg) {
        if (userService == null) {
            UserHelper.userService = userServiceArg;
        }
    }
}
