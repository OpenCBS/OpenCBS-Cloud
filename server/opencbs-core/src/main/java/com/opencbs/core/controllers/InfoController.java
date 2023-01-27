package com.opencbs.core.controllers;

import com.opencbs.core.annotations.CustomInfoController;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.web.bind.annotation.RestController;

@RestController
@ConditionalOnMissingBean(annotation = CustomInfoController.class)
public class InfoController extends AbstractInfoController {
    @Override
    protected String getMessage() {
        return "Welcome to OpenCBS-Cloud API!";
    }
}
