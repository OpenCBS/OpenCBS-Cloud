package com.opencbs.core.configs;

import com.opencbs.core.configs.properties.AccountBalanceCalculationProperties;
import com.opencbs.core.configs.properties.RabbitProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Exchange;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
@RequiredArgsConstructor
public class RabbitMQConfiguration {

    private final RabbitProperties properties;
    private final AccountBalanceCalculationProperties balanceCalculationProperties;


    @Bean
    public Queue balanceCalculationQueue() {
        return new Queue(balanceCalculationProperties.getQueue(), false);
    }

    @Bean
    public Exchange frontDirectExchange() {
        return new DirectExchange(properties.getDirectExchange());
    }

    @Bean
    public Exchange frontFanoutExchange() {
        return new FanoutExchange(properties.getFanoutExchange());
    }

    @Bean
    public Exchange systemTopicExchange() {
        return new TopicExchange(balanceCalculationProperties.getExchange());
    }

    @Bean
    public Binding accountBalanceCalculationBinding() {
        return new Binding(
                balanceCalculationProperties.getQueue(),
                Binding.DestinationType.QUEUE,
                balanceCalculationProperties.getExchange(),
                balanceCalculationProperties.getRoutingKey(),
                Collections.emptyMap()
        );
    }
}
