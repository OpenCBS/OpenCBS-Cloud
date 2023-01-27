package com.opencbs.core.services.messages;

public interface AmpqSenderService {

    void sendObject(String exchange, String routingKey, Object payload);

    void sendMessage(String exchange, String routingKey, Object message);

    void checkConnectionsHealth();
}
