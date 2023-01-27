package com.opencbs.core.controllers;

import com.opencbs.core.dto.VersionDto;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping(value = "/api")
public abstract class AbstractInfoController extends BaseController implements InstanceInformation {

    private static final String DEBUG_MODE = "DEBUG_MODE";

    @GetMapping()
    public String get() {
        return this.getMessage();
    }

    @GetMapping(value = "/info")
    public VersionDto getInfo() {
        Package aPackage = this.getClass().getPackage();
        String version = aPackage.getImplementationVersion();
        String title = aPackage.getImplementationTitle();

        VersionDto versionDto = new VersionDto() {
            {
                setVersion(StringUtils.isEmpty(version) ? DEBUG_MODE : version);
                setTitle(StringUtils.isEmpty(title) ? DEBUG_MODE : title);
                setInstance(getInstanceType());
            }
        };
        return versionDto;
    }

    protected abstract String getMessage();

    protected String getInstanceType() {
        return "";
    }

}
