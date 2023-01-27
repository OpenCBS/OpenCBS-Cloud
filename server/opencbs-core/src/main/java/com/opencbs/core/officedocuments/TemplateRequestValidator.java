package com.opencbs.core.officedocuments;

import com.opencbs.core.officedocuments.domain.PrintingFormRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

@Component
public class TemplateRequestValidator {
    public void validate(PrintingFormRequest request) {
        Assert.notNull(request.getEntityId(), "Entity id is required field.");
        Assert.notNull(request.getTemplateId(), "Template id is required.");
    }
}
