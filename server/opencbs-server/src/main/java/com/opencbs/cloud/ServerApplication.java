package com.opencbs.cloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableAsync
@ComponentScan("com.opencbs")
@EntityScan("com.opencbs")
@EnableScheduling
public class ServerApplication {

    public static void main(String[] args) {

        SpringApplication.run(ServerApplication.class, args);
    }
}
