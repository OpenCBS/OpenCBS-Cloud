package com.opencbs.core.reports;

import com.opencbs.core.officedocuments.domain.fields.DocumentField;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;


public interface Report {

    String getLabel();

    String getName();

    String getGroup();

    String getPoint();

    List<DocumentField> getParameters();

    InputStream build(Map<String, String> requestParameters) throws IOException;
}
