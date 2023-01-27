package com.opencbs.core.services.messages.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencbs.core.services.messages.AmpqSenderService;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class RabbitSenderServiceImpl implements AmpqSenderService {

    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;


    @Autowired
    public RabbitSenderServiceImpl(@NonNull RabbitTemplate rabbitTemplate,
                                   @NonNull ObjectMapper objectMapper) {
        this.rabbitTemplate = rabbitTemplate;
        this.objectMapper = objectMapper;
    }

    @Override
    public void sendMessage(String exchange, String routingKey, Object payload) {
        try {
            rabbitTemplate.convertAndSend(
                    exchange,
                    routingKey,
                    new ObjectMapper().writeValueAsString(payload),
                    message -> {
                        message.getMessageProperties().setContentType("application/json");
                        return message;
                    }
            );
        } catch (JsonProcessingException e) {
            log.error(e.getMessage());
        }
    }

    @Override
    public void sendObject(String exchange, String routingKey, Object payload) {
        try {
            rabbitTemplate.convertAndSend(
                    exchange,
                    routingKey,
                    payload
            );
        } catch (Exception e) {
            log.error(e.getMessage());
        }
    }

    @Override
    public void checkConnectionsHealth() {
        try {
            rabbitTemplate.convertAndSend(
                    "amq.topic",
                    "healthQueue",
                    "check",
                    message -> {
                        message.getMessageProperties().setContentType("application/json");
                        return message;
                    }
            );
// Message healthQueue = rabbitTemplate.receive("healthQueue"); // for future use check back connection
            log.info("Message broker health check");
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException("Connection to Message broker is failed!");
        }
    }
}