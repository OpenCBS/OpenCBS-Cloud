package com.opencbs.core.services;

import com.opencbs.core.domain.User;
import com.opencbs.core.dto.requests.LoginRequest;

import java.util.Optional;

public interface LoginService {

    Optional<User> login(LoginRequest credentials);

    void passwordReset(User user);

    void logout(Long userId);
}
