package com.opencbs.core.helpers;

import com.opencbs.core.configs.properties.RabbitProperties;
import com.opencbs.core.domain.User;
import com.opencbs.core.dto.messenger.MessageDto;
import com.opencbs.core.dto.messenger.MessageType;
import com.opencbs.core.dto.messenger.SystemMessageType;
import com.opencbs.core.services.messages.AmpqSenderService;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AmqMessageHelper {

    private final AmpqSenderService ampqSenderService;
    private final RabbitProperties rabbitProperties;


    @Autowired
    public AmqMessageHelper(AmpqSenderService ampqSenderService,
                            RabbitProperties rabbitProperties) {
        this.ampqSenderService = ampqSenderService;
        this.rabbitProperties = rabbitProperties;
    }

    public void sendMessageToUser(User user, MessageDto message) {
        ampqSenderService.sendMessage(rabbitProperties.getDirectExchange(), user.getId().toString(), message);
    }

    public void sendMessage(String exchange, String routingKey, Object o) {
        ampqSenderService.sendObject(exchange, routingKey, o);
    }

    public void sendSystemMessage(@NonNull SystemMessageType messageType, @NonNull String message) {
        Map<String, String> messageFields = new HashMap<>();
        messageFields.put("type",messageType.getType());
        messageFields.put("message",message);

        MessageDto messageDto = MessageDto.builder()
                .messageType(MessageType.NOTIFICATION)
                .payload(messageFields).build();

        ampqSenderService.sendMessage(rabbitProperties.getFanoutExchange(), "", messageDto);
    }

    public void checkConnectionHealth() {
        this.ampqSenderService.checkConnectionsHealth();
    }
}
