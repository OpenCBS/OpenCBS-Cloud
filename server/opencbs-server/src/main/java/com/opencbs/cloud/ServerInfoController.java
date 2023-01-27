package com.opencbs.cloud;

import com.opencbs.core.annotations.CustomInfoController;
import com.opencbs.core.controllers.AbstractInfoController;

@CustomInfoController
public class ServerInfoController extends AbstractInfoController {
    @Override
    protected String getInstanceType() {
        return "base-server";
    }

    @Override
    protected String getMessage() {
        return "Welcome to OpenCBS API!";
    }
}
