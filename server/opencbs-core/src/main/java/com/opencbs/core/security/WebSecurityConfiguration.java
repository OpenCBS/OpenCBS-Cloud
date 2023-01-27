package com.opencbs.core.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@SuppressWarnings("unused")
public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    private EntryPointUnauthorizedHandler unauthorizedHandler;

    @Bean
    public AuthenticationTokenFilter authenticationTokenFilterBean() throws Exception {
        AuthenticationTokenFilter authenticationTokenFilter = new AuthenticationTokenFilter();
        authenticationTokenFilter.setAuthenticationManager(authenticationManagerBean());
        return authenticationTokenFilter;
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers("/*", "/assets/**", "index.html", "/docs/**", "/webjars/**", "/v2/api-docs/**", "/swagger-resources/**");
    }

    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .csrf()
                .disable()
                .exceptionHandling()
                .authenticationEntryPoint(this.unauthorizedHandler)
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .antMatchers("/api").permitAll()
                .antMatchers("/api/login", "/api/login/update-password", "/api/login/password-reset").permitAll()
                .antMatchers(HttpMethod.GET, "/api/profiles/people/{personId}/attachments/{attachmentId}").permitAll()
                .antMatchers(HttpMethod.GET, "/api/profiles/companies/{companiesId}/attachments/{attachmentId}").permitAll()
                .antMatchers(HttpMethod.GET, "/api/profiles/groups/{groupId}/attachments/{attachmentId}").permitAll()
                .antMatchers(HttpMethod.GET, "/api/loan-applications/{loanApplicationId}/attachments/{attachmentId}").permitAll()
                .antMatchers(HttpMethod.GET, "/api/loans/{loanId}/attachments/{attachmentId}").permitAll()
                .antMatchers(HttpMethod.GET, "/api/info").permitAll()
                .antMatchers(HttpMethod.GET, "/api/system-settings").permitAll()
                .antMatchers(HttpMethod.GET, "/api/utils/**").permitAll()
                .antMatchers(HttpMethod.POST, "/api/utils/**").permitAll()
                .anyRequest().authenticated();

        httpSecurity
                .addFilterBefore(authenticationTokenFilterBean(), UsernamePasswordAuthenticationFilter.class);
    }
}
