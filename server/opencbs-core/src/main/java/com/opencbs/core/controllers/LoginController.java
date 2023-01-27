package com.opencbs.core.controllers;

import com.opencbs.core.domain.User;
import com.opencbs.core.dto.PasswordUpdateDto;
import com.opencbs.core.dto.requests.LoginRequest;
import com.opencbs.core.dto.responses.ApiResponse;
import com.opencbs.core.exceptions.InvalidCredentialsException;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.mappers.UserMapper;
import com.opencbs.core.security.TokenHelper;
import com.opencbs.core.services.LoginService;
import com.opencbs.core.services.UserService;
import com.opencbs.core.validators.UserDtoValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by Pavel Bastov on 07/01/2017.
 */
@RestController
@SuppressWarnings("unused")
@RequestMapping(value = "/api")
public class LoginController extends BaseController {

    private final LoginService loginService;
    private final TokenHelper tokenHelper;
    private final UserService userService;
    private final UserDtoValidator userDtoValidator;
    private final UserMapper userMapper;

    @Autowired
    public LoginController(LoginService loginService,
                           TokenHelper tokenHelper,
                           UserService userService,
                           UserDtoValidator userDtoValidator,
                           UserMapper userMapper) {
        this.loginService = loginService;
        this.tokenHelper = tokenHelper;
        this.userService = userService;
        this.userDtoValidator = userDtoValidator;
        this.userMapper = userMapper;
    }

    @PostMapping(value = "/login")
    public ApiResponse<String> login(@RequestBody LoginRequest loginRequest) throws InvalidCredentialsException {
        return this.loginService.login(loginRequest)
                .map(user -> ReturnResponse(this.tokenHelper.tokenFor(user)))
                .orElseThrow(InvalidCredentialsException::new);
    }

    @PutMapping(value = "/login/update-password")
    public String changePassword(@RequestBody PasswordUpdateDto dto) {
        User user = this.userService.findById(dto.getUserId()).orElseThrow(
                () -> new ResourceNotFoundException(String.format("User is not found (ID=%d).", dto.getUserId())));
        this.userDtoValidator.validatePasswordCreate(dto.getPassword());
        this.userService.save(this.userMapper.mapUpdatePassword(user, dto));
        return "Password has been successfully changed";
    }

    @PostMapping(value = "/login/password-reset")
    public String passwordReset(@RequestParam(value = "username") String username) {
        User user = this.userService.findByEmailOrUsername(username).orElseThrow(
                () -> new ResourceNotFoundException(String.format("User is not found (Username = %s).", username)));
        this.userDtoValidator.validateEmail(user);
        this.loginService.passwordReset(user);
        return "Check your email.";
    }

    @PostMapping(value = "/logout/{userId}")
    public void logout(@PathVariable(value = "userId") Long userId) {
        this.loginService.logout(userId);
    }
}
