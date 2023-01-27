package com.opencbs.core.dto.messenger;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RabbitCredentials {

    private String host;

    private String username;

    private String password;

    private String virtualHost;

    private String directExchange;

    private String fanoutExchange;
}
