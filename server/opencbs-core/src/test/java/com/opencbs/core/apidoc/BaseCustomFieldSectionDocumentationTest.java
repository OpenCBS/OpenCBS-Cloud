package com.opencbs.core.apidoc;

import org.springframework.restdocs.payload.FieldDescriptor;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;

abstract class BaseCustomFieldSectionDocumentationTest extends BaseDocumentationTest {

    List<FieldDescriptor> getResponseFieldsForCustomFieldSectionList() {
        List<FieldDescriptor> fields = new ArrayList<>();
        fields.add(fieldWithPath("[]").description("An array of custom field sections."));
        fields.addAll(this.getCustomFieldSectionFieldDescriptors("[]."));
        fields.addAll(this.getCustomFieldFieldDescriptors("[].customFields[]."));
        return fields;
    }

    List<FieldDescriptor> getResponseFieldsForCustomFieldSection() {
        List<FieldDescriptor> fields = new ArrayList<>();
        fields.addAll(this.getCustomFieldSectionFieldDescriptors(""));
        fields.addAll(this.getCustomFieldFieldDescriptors("customFields[]."));
        return fields;
    }
}
