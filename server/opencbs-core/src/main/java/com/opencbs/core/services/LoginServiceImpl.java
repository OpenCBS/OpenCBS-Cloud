package com.opencbs.core.services;

import com.opencbs.core.domain.SystemSettings;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.StatusType;
import com.opencbs.core.domain.enums.SystemSettingsName;
import com.opencbs.core.dto.requests.LoginRequest;
import com.opencbs.core.email.EmailService;
import com.opencbs.core.email.TemplateGenerator;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.exceptions.UnauthorizedException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.security.TokenHelper;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class LoginServiceImpl implements LoginService {

    private final UserService userService;
    private final SystemSettingsService systemSettingsService;
    private final TokenHelper tokenHelper;
    private final EmailService emailService;


    @Override
    public Optional<User> login(LoginRequest credentials) {
        Optional<User> currentUser = Optional.ofNullable(this.userService.findByUsername(credentials.getUsername())
                .filter(user -> BCrypt.checkpw(credentials.getPassword(), user.getPasswordHash()))
                .orElseThrow(() -> new ResourceNotFoundException("Incorrect username or password.")));
        if (currentUser.isPresent()) {
            if (!StatusType.ACTIVE.equals(currentUser.get().getStatusType())){
                throw new UnauthorizedException(currentUser.get().getId().toString(), "User is disabled.");
            }

            this.checkFirstLogin(currentUser.get());

            if (DateHelper.getLocalDateNow().isAfter(currentUser.get().getExpireDate())) {
                throw new UnauthorizedException(currentUser.get().getId().toString(), "Password expired");
            }
        }
        tokenHelper.setEventInformation(currentUser.get());
        return currentUser;
    }

    private void checkFirstLogin(User user) {
        Optional<SystemSettings> firstLogIn = this.systemSettingsService.findByName(SystemSettingsName.FIRST_LOG_IN);
        if (firstLogIn.isPresent()) {
            boolean firstLog = Boolean.parseBoolean(firstLogIn.get().getValue());
            if (firstLog) {
                if (user.getFirstLogin()) {
                    throw new UnauthorizedException(user.getId().toString(), "Set a new password");
                }
            }
        }
    }

    public void passwordReset(User user) {
        String newPwd = this.passwordGenerate();
        user.setPasswordHash(newPwd);
        this.sendResetPasswordEmail(user, newPwd);
        this.userService.save(user);
    }

    private String passwordGenerate() {
        String pwd = RandomStringUtils.random(15, true, true);
        return pwd;
    }

    @Override
    public void logout(Long userId) {
    }

    @SneakyThrows
    public void sendResetPasswordEmail(User user, String newPassword ) {
        Map<String, Object> variables = new HashMap();
        variables.put("title", "Password reset");
        variables.put("username", user.getUsername());
        variables.put("password", newPassword);

        this.emailService.sendEmail(Collections.singletonList(user.getEmail()),
                    "Password reset",
                    TemplateGenerator.getContent("password_reset.html", variables));

    }
}
