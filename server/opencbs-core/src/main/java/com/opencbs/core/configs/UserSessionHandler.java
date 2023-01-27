package com.opencbs.core.configs;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.UserSession;
import com.opencbs.core.dto.requests.LoginRequest;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.services.UserService;
import com.opencbs.core.services.UserSessionService;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.stream.Collectors;

@Slf4j
@Component
public class UserSessionHandler extends HandlerInterceptorAdapter {

    static private final String PATH_LOGIN = "/login";

    private final UserSessionService userSessionService;

    private final UserService userService;


    @Autowired
    public UserSessionHandler(UserSessionService userSessionService, UserService userService) {
        this.userSessionService = userSessionService;
        this.userService = userService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response, Object handler) throws Exception {
        if ("POST".equalsIgnoreCase(request.getMethod())) {
            processingUserSession(request);
        }
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request,
                           HttpServletResponse response, Object handler,
                           ModelAndView modelAndView) throws Exception {
    }

    @Override
    public void afterCompletion(HttpServletRequest request,
                                HttpServletResponse response, Object handler, Exception ex) throws Exception {
        if (!isLogin(request)) {
            return;
        }

        if (response.getStatus() == HttpStatus.OK.value()) {
            LoginRequest loginRequest = getLoginRequest(request);
            User user = userService.findByUsername(loginRequest.getUsername()).get();
            userSessionService.setSuccessLoginStatus(user, request.getRemoteHost());
        }
    }

    private boolean isLogin(@NonNull HttpServletRequest request) {
        return !HttpMethod.OPTIONS.matches(request.getMethod()) && request.getServletPath().indexOf(PATH_LOGIN) > 1;
    }

    private void processingUserSession(HttpServletRequest request) throws IOException {
        UserSession userSession = UserSession.builder()
                .ip(request.getRemoteHost())
                .lastEntryTime(DateHelper.getLocalDateTimeNow())
                .build();

        if (isLogin(request)) {
            LoginRequest loginRequest = getLoginRequest(request);
            userSession.setUserName(loginRequest.getUsername());
            userSession.setLoginActionType(UserSession.LoginActionType.LOGIN);
        } else {
            User currentUser = UserHelper.getCurrentUser();
            userSession.setUserName(currentUser.getUsername());
            userSession.setLoginActionType(UserSession.LoginActionType.LOGOUT);
            userSession.setLoginStatusType(UserSession.LoginStatusType.SUCCESS);
        }

        userSessionService.save(userSession);
    }

    private LoginRequest getLoginRequest(HttpServletRequest request) throws IOException {
        String json = request.getReader().lines().collect(Collectors.joining());
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(json, LoginRequest.class);
        }
        catch (Exception exc){
            return objectMapper.readValue(json, LoginRequest.class);
        }
    }
}