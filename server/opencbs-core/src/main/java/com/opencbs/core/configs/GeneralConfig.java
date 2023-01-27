package com.opencbs.core.configs;

import com.opencbs.core.configs.properties.AttachmentProperty;
import com.opencbs.core.configs.properties.CoreModuleProperties;
import com.opencbs.core.configs.properties.TemplateProperty;
import com.opencbs.core.domain.User;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.security.UserAuditorAwareImpl;
import org.modelmapper.ModelMapper;
import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.envers.repository.support.EnversRevisionRepositoryFactoryBean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import java.text.SimpleDateFormat;

@Configuration
@EnableJpaAuditing
@EnableAspectJAutoProxy()
@EnableConfigurationProperties({
        AttachmentProperty.class,
        TemplateProperty.class,
        CoreModuleProperties.class})
@EnableJpaRepositories(value = "com.opencbs", repositoryFactoryBeanClass = EnversRevisionRepositoryFactoryBean.class)
@EnableScheduling
@AutoConfigureAfter
@SuppressWarnings("unused")
public class GeneralConfig {
    @Bean
    public Jackson2ObjectMapperBuilder jacksonBuilder() {
        Jackson2ObjectMapperBuilder b = new Jackson2ObjectMapperBuilder();
        b.indentOutput(true).dateFormat(new SimpleDateFormat(DateHelper.DATE_FORMAT));
        return b;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuditorAware<User> auditorProvider() {
        return new UserAuditorAwareImpl();
    }

    @Bean
    public ModelMapper getModelMapper() {
        return new ModelMapper();
    }

    @Bean
    public CommonsMultipartResolver multipartResolver() {
        CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver();
        return multipartResolver;
    }

}
