package com.opencbs.core.apidoc;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.opencbs.core.domain.customfields.CompanyCustomFieldSection;
import com.opencbs.core.dto.UpdateCustomFieldSectionDto;
import com.opencbs.core.services.customFields.CompanyCustomFieldSectionService;
import lombok.Data;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.get;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.requestFields;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class CompanyCustomFieldSectionDocumentationTest extends BaseCustomFieldSectionDocumentationTest {

    private final static String ENDPOINT = "/api/profiles/companies/custom-field-sections";

    @Autowired
    private CompanyCustomFieldSectionService companyCustomFieldSectionService;

    private String authHeader;

    @Before
    @Override
    public void setup() throws Exception {
        super.setup();
        this.authHeader = this.login();
    }

    @Test
    public void getSections() throws Exception {
        this.mockMvc
                .perform(
                        get(ENDPOINT)
                                .header("Authorization", this.authHeader)
                )
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "companies-custom-field-sections-getOne-all-example",
                                responseFields(this.getResponseFieldsForCustomFieldSectionList())
                        )
                );
    }

    @Test
    public void getSection() throws Exception {
        this.mockMvc
                .perform(
                        get(ENDPOINT + "/1")
                                .header("Authorization", this.authHeader)
                )
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "companies-custom-field-sections-getOne-example",
                                responseFields(this.getResponseFieldsForCustomFieldSection())
                        )
                );
    }

    @Test
    public void createSection() throws Exception {
        UpdateCustomFieldSectionDto createDto = new UpdateCustomFieldSectionDto();
        createDto.setCaption("Financial Info");

        this.mockMvc
                .perform(
                        post(ENDPOINT)
                                .header("Authorization", this.authHeader)
                                .content(this.asJson(createDto, CreateIgnoreMask.class))
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "companies-custom-field-sections-create-example",
                                requestFields(
                                        fieldWithPath("caption").description("The caption of the new section.")
                                ),
                                responseFields(this.getResponseFieldsForCustomFieldSectionList())
                        )
                );
    }

    @Test
    public void updateSection() throws Exception {
        this.createFinancialInfoSection();

        UpdateCustomFieldSectionDto updateDto = new UpdateCustomFieldSectionDto();
        updateDto.setCaption("FINANCIAL INFO");
        updateDto.setOrder(1);

        this.mockMvc
                .perform(
                        put(ENDPOINT + "/2")
                                .header("Authorization", this.authHeader)
                                .content(this.asJson(updateDto, UpdateIgnoreMask.class))
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "companies-custom-field-sections-update-example",
                                requestFields(
                                        fieldWithPath("caption").description("A new caption."),
                                        fieldWithPath("order").description("A new order.")
                                ),
                                responseFields(this.getResponseFieldsForCustomFieldSectionList())
                        )
                );
    }

    @Data
    private class CreateIgnoreMask {

        @JsonIgnore
        private long id;

        @JsonIgnore
        private int order;
    }

    @Data
    private class UpdateIgnoreMask {

        @JsonIgnore
        private long id;
    }

    private CompanyCustomFieldSection createFinancialInfoSection() {
        CompanyCustomFieldSection section = new CompanyCustomFieldSection();
        section.setCaption("Financial Info");
        return this.companyCustomFieldSectionService.create(section);
    }
}
