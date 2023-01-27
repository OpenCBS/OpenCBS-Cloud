package com.opencbs.core.apidoc;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.opencbs.core.domain.customfields.CustomFieldExtra;
import com.opencbs.core.domain.customfields.PersonCustomField;
import com.opencbs.core.domain.customfields.PersonCustomFieldSection;
import com.opencbs.core.domain.enums.CustomFieldType;
import com.opencbs.core.dto.customfields.CustomFieldDto;
import com.opencbs.core.services.customFields.PersonCustomFieldSectionService;
import com.opencbs.core.services.customFields.PersonCustomFieldService;
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
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.post;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.restdocs.payload.PayloadDocumentation.requestFields;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class PersonCustomFieldDocumentationTest extends BaseCustomFieldSectionDocumentationTest {

    private final static String ENDPOINT = "/api/profiles/people/custom-fields";

    private String authHeader;

    @Autowired
    private PersonCustomFieldSectionService personCustomFieldSectionService;

    @Autowired
    private PersonCustomFieldService personCustomFieldService;

    @Before
    @Override
    public void setup() throws Exception {
        super.setup();
        this.authHeader = this.login();
    }

    @Test
    public void createCustomField() throws Exception {
        CustomFieldDto cityCustomFieldDto = this.getCityCustomFieldDto();

        List<FieldDescriptor> requestFieldDescriptors = this.getCustomFieldFieldDescriptors("")
                .stream()
                .filter(x -> !"id".equals(x.getPath()) && !"order".equals(x.getPath()))
                .collect(Collectors.toList());

        String encodedContent = this.asJson(cityCustomFieldDto);
        System.out.println(encodedContent);

        this.mockMvc
                .perform(
                        post(ENDPOINT)
                                .header("Authorization", this.authHeader)
                                .content(this.asJson(cityCustomFieldDto, CreateDtoIgnoreMask.class))
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "people-custom-fields-create-example",
                                requestFields(requestFieldDescriptors),
                                responseFields(this.getResponseFieldsForCustomFieldSectionList())
                        )
                );
    }

    @Test
    public void updateCustomField() throws Exception {
        this.createCityCustomField();

        CustomFieldDto cityCustomFieldDto = this.getCityCustomFieldDto();
        cityCustomFieldDto.setOrder(1);
        cityCustomFieldDto.setCaption("City of Residence");

        List<FieldDescriptor> requestFieldDescriptors = this.getCustomFieldFieldDescriptors("")
                .stream()
                .filter(x -> !"id".equals(x.getPath()))
                .collect(Collectors.toList());

        this.mockMvc
                .perform(
                        put(ENDPOINT + "/4")
                                .header("Authorization", this.authHeader)
                        .content(this.asJson(cityCustomFieldDto, UpdateDtoIgnoreMask.class))
                        .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "people-custom-fields-update-example",
                                requestFields(requestFieldDescriptors),
                                responseFields(this.getResponseFieldsForCustomFieldSectionList())
                )
        );
    }

    @SuppressWarnings("unused")
    private abstract class CreateDtoIgnoreMask {

        @JsonIgnore
        long id;

        @JsonIgnore
        int order;
    }

    @SuppressWarnings("unused")
    private abstract class UpdateDtoIgnoreMask {

        @JsonIgnore
        long id;
    }

    private CustomFieldDto getCityCustomFieldDto() {
        CustomFieldDto customFieldDto = new CustomFieldDto();
        customFieldDto.setSectionId(1L);
        customFieldDto.setFieldType(CustomFieldType.LOOKUP);
        customFieldDto.setName("city");
        customFieldDto.setCaption("City");
        customFieldDto.setRequired(true);
        customFieldDto.setUnique(false);
        CustomFieldExtra extra = new CustomFieldExtra();
        extra.put("key", "locations");
        customFieldDto.setExtra(extra);
        return customFieldDto;
    }

    private PersonCustomField createCityCustomField() {
        Optional<PersonCustomFieldSection> section = this.personCustomFieldSectionService.findOne(1L);
        if (!section.isPresent()) {
            throw new RuntimeException("Section is not found.");
        }

        PersonCustomField cityCustomField = new PersonCustomField();
        cityCustomField.setFieldType(CustomFieldType.LOOKUP);
        cityCustomField.setName("city");
        cityCustomField.setCaption("City");
        cityCustomField.setRequired(true);
        cityCustomField.setUnique(false);
        cityCustomField.setSection(section.get());
        CustomFieldExtra extra = new CustomFieldExtra();
        extra.put("key", "locations");
        cityCustomField.setExtra(extra);
        return this.personCustomFieldService.create(cityCustomField);
    }
}
