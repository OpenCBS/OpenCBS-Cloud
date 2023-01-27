package com.opencbs.core.apidoc;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.opencbs.core.domain.customfields.CompanyCustomField;
import com.opencbs.core.domain.customfields.CompanyCustomFieldSection;
import com.opencbs.core.domain.enums.CustomFieldType;
import com.opencbs.core.dto.customfields.CustomFieldDto;
import com.opencbs.core.services.customFields.CompanyCustomFieldSectionService;
import com.opencbs.core.services.customFields.CompanyCustomFieldService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.restdocs.payload.FieldDescriptor;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.payload.PayloadDocumentation.requestFields;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class CompanyCustomFieldDocumentationTest extends BaseCustomFieldSectionDocumentationTest {

    private final static String ENDPOINT = "/api/profiles/companies/custom-fields";

    private String authHeader;

    @Autowired
    private CompanyCustomFieldSectionService companyCustomFieldSectionService;

    @Autowired
    private CompanyCustomFieldService companyCustomFieldService;

    @Before
    @Override
    public void setup() throws Exception {
        super.setup();
        this.authHeader = this.login();
    }

    @Test
    public void createCustomField() throws Exception {
        CustomFieldDto addressCustomFieldDto = this.getAddressCustomFieldDto();

        List<FieldDescriptor> requestFieldDescriptors = this.getCustomFieldFieldDescriptors("")
                .stream()
                .filter(x -> !"id".equals(x.getPath()) && !"order".equals(x.getPath()))
                .collect(Collectors.toList());

        this.mockMvc
                .perform(
                        post(ENDPOINT)
                                .header("Authorization", this.authHeader)
                                .content(this.asJson(addressCustomFieldDto, CreateIgnoreMask.class))
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "companies-custom-fields-create-example",
                                requestFields(requestFieldDescriptors),
                                responseFields(this.getResponseFieldsForCustomFieldSectionList())
                        )
                );
    }

    @Test
    public void updateCustomField() throws Exception {
        this.createAddressCustomField();

        CustomFieldDto addressCustomFieldDto = this.getAddressCustomFieldDto();
        addressCustomFieldDto.setOrder(1);
        addressCustomFieldDto.setCaption("ADDRESS");

        List<FieldDescriptor> requestFieldDescriptors = this.getCustomFieldFieldDescriptors("")
                .stream()
                .filter(x -> !"id".equals(x.getPath()))
                .collect(Collectors.toList());

        this.mockMvc
                .perform(
                        put(ENDPOINT + "/6")
                                .header("Authorization", this.authHeader)
                                .content(this.asJson(addressCustomFieldDto, UpdateIgnoreMask.class))
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "companies-custom-fields-update-example",
                                requestFields(requestFieldDescriptors),
                                responseFields(this.getResponseFieldsForCustomFieldSectionList())
                        )
                );
    }

    @SuppressWarnings("unused")
    private class CreateIgnoreMask {

        @JsonIgnore
        private long id;

        @JsonIgnore
        private int order;
    }

    @SuppressWarnings("unused")
    private class UpdateIgnoreMask {

        @JsonIgnore
        private int id;
    }

    private CustomFieldDto getAddressCustomFieldDto() {
        CustomFieldDto customFieldDto = new CustomFieldDto();
        customFieldDto.setSectionId(1L);
        customFieldDto.setFieldType(CustomFieldType.TEXT);
        customFieldDto.setName("address");
        customFieldDto.setCaption("Address");
        customFieldDto.setRequired(true);
        customFieldDto.setUnique(false);
        return customFieldDto;
    }

    private CompanyCustomField createAddressCustomField() {
        Optional<CompanyCustomFieldSection> section = this.companyCustomFieldSectionService.findOne(1L);
        if (!section.isPresent()) {
            throw new RuntimeException("Section is not found.");
        }

        CompanyCustomField cityCustomField = new CompanyCustomField();
        cityCustomField.setFieldType(CustomFieldType.TEXT);
        cityCustomField.setName("address");
        cityCustomField.setCaption("Address");
        cityCustomField.setRequired(true);
        cityCustomField.setUnique(false);
        cityCustomField.setSection(section.get());
        return this.companyCustomFieldService.create(cityCustomField);
    }
}
