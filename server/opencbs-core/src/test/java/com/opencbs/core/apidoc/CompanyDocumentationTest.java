package com.opencbs.core.apidoc;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.customfields.CompanyCustomFieldValue;
import com.opencbs.core.domain.profiles.Company;
import com.opencbs.core.dto.CompanyDto;
import com.opencbs.core.dto.FieldValueDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.customFields.CompanyCustomFieldService;
import com.opencbs.core.services.CompanyService;
import com.opencbs.core.services.UserService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.restdocs.payload.FieldDescriptor;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.get;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.post;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.put;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.requestFields;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class CompanyDocumentationTest extends BaseDocumentationTest {

    private static final String ENDPOINT = "/api/profiles/companies";

    private String authHeader;

    @Autowired
    private CompanyService companyService;

    @Autowired
    private CompanyCustomFieldService companyCustomFieldService;

    @Autowired
    private UserService userService;

    @Before
    @Override
    public void setup() throws Exception {
        super.setup();
        this.authHeader = this.login();
    }

    @Test
    public void getCompany() throws Exception {
        Map<String, String> attributes = new HashMap<>();
        attributes.put("name", "Mo's Spaza Shop");
        attributes.put("business_sector", "2"); // 2 -> Trade and Commerce
        this.createCompany(attributes);

        this.mockMvc
                .perform(
                        get(ENDPOINT + "/1")
                                .header("Authorization", this.authHeader)
                                .accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "companies-getOne-example",
                                responseFields(this.getCompanyResponseFields())
                        )
                );
    }

    @Test
    public void createCompany() throws Exception {
        Map<String, String> attributes = new HashMap<>();
        attributes.put("name", "Kafue Seeds and Fertilizers");
        attributes.put("business_sector", "2"); // 2 -> Trade and Commerce
        CompanyDto companyDto = this.mapToCompanyDto(attributes);

        this.mockMvc.perform(
                post(ENDPOINT)
                        .header("Authorization", this.authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(this.asJson(companyDto, IgnoreMask.class)))
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "companies-create-example",
                                requestFields(this.getCompanyUpdateRequestFields()),
                                responseFields(this.getCompanyResponseFields())
                        )
                );
    }

    @Test
    public void updateCompany() throws Exception {
        Map<String, String> attributes = new HashMap<>();
        attributes.put("name", "Kafue Seeds and Fertilizers");
        attributes.put("business_sector", "2"); // 2 -> Trade and Commerce
        this.createCompany(attributes);

        attributes.put("name", "Kafue Seeds & Fertilizers");
        attributes.put("business_sector", "1"); // 1 -> Agriculture
        CompanyDto companyDto = this.mapToCompanyDto(attributes);

        this.mockMvc.perform(
                put(ENDPOINT+ "/1")
                        .header("Authorization", this.authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(this.asJson(companyDto, IgnoreMask.class)))
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "companies-update-example",
                                requestFields(this.getCompanyUpdateRequestFields()),
                                responseFields(this.getCompanyResponseFields())
                        )
                );
    }

    @Test
    public void getLookup() throws Exception {
        Map<String, String> attributes = new HashMap<>();
        attributes.put("name", "Mo's Spaza Shop");
        attributes.put("business_sector", "2"); // 2 -> Trade and Commerce
        this.createCompany(attributes);

        this.mockMvc
                .perform(
                        get(ENDPOINT + "/lookup")
                                .header("Authorization", this.authHeader)
                                .accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "companies-getOne-lookup-example",
                                responseFields(this.getCompanyLookupResponseFields())
                        )
                );
    }

    @SuppressWarnings("unused")
    private class IgnoreMask {
        @JsonIgnore
        private long id;
    }

    private Company createCompany(Map<String, String> attributes) throws ResourceNotFoundException {
        Company company = new Company();
        company.setAttachments(null);
        company.setName(attributes.get("name"));
        company.setCreatedAt(DateHelper.getLocalDateTimeNow());
        //noinspection OptionalGetWithoutIsPresent
        company.setCreatedBy(this.userService.findById(1L).get());

        List<CompanyCustomFieldValue> customFieldValues = this.companyCustomFieldService.findAll()
                .stream()
                .map(cf -> {
                    CompanyCustomFieldValue customFieldValue = new CompanyCustomFieldValue();
                    customFieldValue.setValue(attributes.getOrDefault(cf.getName(), ""));
                    customFieldValue.setCustomField(cf);
                    customFieldValue.setOwner(company);
                    return customFieldValue;
                })
                .collect(Collectors.toList());
        company.setCustomFieldValues(customFieldValues);
        User user = new User();
        user.setId(1L);
        return this.companyService.create(company, user, true);
    }

    private CompanyDto mapToCompanyDto(Map<String, String> attributes) {
        CompanyDto companyDto = new CompanyDto();
        companyDto.setFieldValues(
                this.companyCustomFieldService.findAll()
                .stream()
                .map(cf -> {
                    FieldValueDto fieldValueDto = new FieldValueDto();
                    fieldValueDto.setFieldId(cf.getId());
                    fieldValueDto.setValue(attributes.getOrDefault(cf.getName(), ""));
                    return fieldValueDto;
                })
                .collect(Collectors.toList())
        );
        return companyDto;
    }

    private List<FieldDescriptor> getCompanyUpdateRequestFields() {
        List<FieldDescriptor> requestFields = new ArrayList<>();
        requestFields.add(fieldWithPath("fieldValues[]").description("An array of custom field values"));
        requestFields.add(fieldWithPath("fieldValues[].fieldId").description("The ID of the custom field. Please note that the field should be a valid custom field of type `COMPANY`. Otherwise you will getOne a `400 Bad Request` error."));
        requestFields.add(fieldWithPath("fieldValues[].value").description("The value associated with the custom field. Please note that the values should satisfy all the constraints defined by the custom field. Otherwise you will getOne a `400 Bad Request` error."));
        return requestFields;
    }

    private List<FieldDescriptor> getCompanyResponseFields() {
        List<FieldDescriptor> responseFields = new ArrayList<>();
        responseFields.add(fieldWithPath("id").description("The ID of the person."));
        responseFields.add(fieldWithPath("name").description("The full name of the person."));
        //responseFields.add(fieldWithPath("createdBy").description("Who created the person."));
        //responseFields.add(fieldWithPath("createdAt").description("When the person was created."));
        responseFields.add(fieldWithPath("attachments").description("An array of attachments."));
        responseFields.add(fieldWithPath("currentAccounts").description("An array of current accounts."));
        responseFields.add(fieldWithPath("status").description("Current status of the company."));
        responseFields.addAll(this.getCustomFieldSectionWithValueFieldDescriptors());
        return responseFields;
    }

    private List<FieldDescriptor> getCompanyLookupResponseFields() {
        List<FieldDescriptor> responseFields = new ArrayList<>();
        responseFields.add(fieldWithPath("content").description("Array of lookups."));
        responseFields.add(fieldWithPath("content[].id").description("The ID of the Company."));
        responseFields.add(fieldWithPath("content[].name").description("The name of the Company."));
        responseFields.add(fieldWithPath("content[].attachments").description("An array of attachments."));
        responseFields.addAll(this.getPageableDescriptors());
        return responseFields;
    }
}
