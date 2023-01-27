package com.opencbs.core.officedocuments.services;

import com.opencbs.core.officedocuments.domain.fields.DocumentField;
import com.opencbs.core.reports.Report;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

@Component
public class StubReport implements Report {
    @Override
    public String getLabel() {
        return null;
    }

    @Override
    public String getName() {
        return null;
    }

    @Override
    public String getGroup() {
        return null;
    }

    @Override
    public String getPoint() {
        return null;
    }

    @Override
    public List<DocumentField> getParameters() {
        return null;
    }

    @Override
    public InputStream build(Map<String, String> requestParameters) throws IOException {
        return null;
    }
}
