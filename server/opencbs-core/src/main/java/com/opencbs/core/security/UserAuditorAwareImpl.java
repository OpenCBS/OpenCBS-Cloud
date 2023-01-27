package com.opencbs.core.security;


import com.opencbs.core.domain.User;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;


public class UserAuditorAwareImpl implements AuditorAware<User> {
    @Override
    public User getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        return (User) authentication.getPrincipal();
    }
}
