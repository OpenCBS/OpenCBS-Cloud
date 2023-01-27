package com.opencbs.core.configs;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class WebMvcConfig extends WebMvcConfigurerAdapter {

    private final UserSessionHandler userSessionHandler;

    public WebMvcConfig(UserSessionHandler userSessionHandler) {
        this.userSessionHandler = userSessionHandler;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**").allowedMethods("*");
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(userSessionHandler)
                .addPathPatterns("/api/login")
                .addPathPatterns("/api/logout/*")
                .excludePathPatterns("/resources/**");
    }

}