package com.opencbs.core.officedocuments.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.opencbs.core.officedocuments.enums.LoaderServiceType;
import lombok.Data;

import java.nio.file.Path;

@Data
public class Template {
    private String label;
    private String point;
    private Integer id;
    private String name;
    private String group;

    @JsonIgnore
    private Path path;

    private LoaderServiceType loaderType = LoaderServiceType.EXCEL_LOADER;
}