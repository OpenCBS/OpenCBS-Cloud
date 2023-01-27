package com.opencbs.core.dto.requests;

import lombok.Data;

/**
 * Created by Pavel Bastov on 07/01/2017.
 */
@Data
public class LoginRequest {

    private String username;
    private String password;

}
