package com.opencbs.core.security;

import org.springframework.stereotype.Component;

/**
 * Created by Pavel Bastov on 07/01/2017.
 */
@Component
public class SecretKeyProvider {

    public byte[] getKey() {
        // TODO: return a real secret string
        return "secret".getBytes();
    }
}
