package com.opencbs.core.apidoc;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.opencbs.core.domain.trees.BusinessSector;
import com.opencbs.core.dto.UpdateTreeEntityDto;
import com.opencbs.core.services.BusinessSectorService;
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

import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.get;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.post;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.requestFields;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class BusinessSectorDocumentationTest extends BaseDocumentationTest {

    private static final String ENDPOINT = "/api/business-sectors";

    private String authHeader;

    @Autowired
    private BusinessSectorService businessSectorService;

    @Before
    @Override
    public void setup() throws Exception {
        super.setup();
        this.authHeader = this.login();
    }

    @Test
    public void getBusinessSector() throws Exception {
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("name", "Travel");
        attributes.put("parent", null);
        this.createBusinessSector(attributes);

        this.mockMvc
                .perform(
                        get(ENDPOINT + "/1")
                                .header("Authorization", this.authHeader)
                                .accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "business-sector-getOne-example",
                                responseFields(this.getBusinessSectorResponseFields())
                        )
                );
    }

    @SuppressWarnings("unused")
    private class IgnoreMask {
        @JsonIgnore
        private long id;
    }

    @Test
    public void createBusinessSector() throws Exception {
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("name", "Education");
        attributes.put("parent", null);
        UpdateTreeEntityDto treeEntityDto = this.mapToBusinessSector(attributes);
        this.mockMvc.perform(
                post(ENDPOINT)
                        .header("Authorization", this.authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(this.asJson(treeEntityDto, BusinessSectorDocumentationTest.IgnoreMask.class)))
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "business-sector-create-example",
                                requestFields(this.getBusinessSectorUpdateRequestFields()),
                                responseFields(this.getBusinessSectorResponseFields())
                        )
                );
    }

    @Test
    public void createChildBusinessSector() throws Exception {
        Map<String, Object> child = new HashMap<>();
        child.put("id", 2L);
        child.put("name", "Textile");
        child.put("parent", 4L);

        Map<String, Object> parent = new HashMap<>();
        parent.put("id", 5L);
        parent.put("name", "Light Industry");
        this.createBusinessSector(parent);

        UpdateTreeEntityDto treeEntityDto = this.mapToBusinessSector(child);
        this.mockMvc.perform(
                post(ENDPOINT)
                        .header("Authorization", this.authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(this.asJson(treeEntityDto, BusinessSectorDocumentationTest.IgnoreMask.class)))
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "business-sector-children-create-example",
                                requestFields(this.getBusinessSectorUpdateRequestFields()),
                                responseFields(this.getBusinessSectorResponseFields())
                        )
                );

    }

    @Test
    public void updateBusinessSector() throws Exception {
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("name", "Heavy Industry");
        this.createBusinessSector(attributes);

        attributes.put("name", "Farming");
        UpdateTreeEntityDto treeEntityDto = this.mapToBusinessSector(attributes);

        this.mockMvc.perform(
                post(ENDPOINT)
                        .header("Authorization", this.authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(this.asJson(treeEntityDto, BusinessSectorDocumentationTest.IgnoreMask.class)))
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "business-sector-children-update-example",
                                requestFields(this.getBusinessSectorUpdateRequestFields()),
                                responseFields(this.getBusinessSectorResponseFields())
                        )
                );
    }

    @Test
    public void getLookupBusinessSector() throws Exception {
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("name", "Education");
        this.createBusinessSector(attributes);

        this.mockMvc
                .perform(
                        get(ENDPOINT + "/lookup")
                                .header("Authorization", this.authHeader)
                                .accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "business-sector-getOne-lookup-example",
                                responseFields(this.getLookupBusinessSectorResponseFields())

                        )
                );
    }

    private void createBusinessSector(Map<String, Object> attributes) {
        BusinessSector businessSector = new BusinessSector();
        businessSector.setName((String) attributes.get("name"));
        businessSector.setParent((BusinessSector) attributes.get("parent"));
        this.businessSectorService.create(businessSector);
    }

    private UpdateTreeEntityDto mapToBusinessSector(Map<String, Object> attributes) {
        UpdateTreeEntityDto treeEntityDto = new UpdateTreeEntityDto();
        treeEntityDto.setName((String) attributes.get("name"));
        treeEntityDto.setParentId((Long) attributes.get("parent"));
        return treeEntityDto;
    }

    private List<FieldDescriptor> getBusinessSectorResponseFields() {
        List<FieldDescriptor> fieldDescriptors = new ArrayList<>();
        fieldDescriptors.add(fieldWithPath("data").description("The data of the business sector."));
        fieldDescriptors.add(fieldWithPath("data.id").description("The ID of the business sector."));
        fieldDescriptors.add(fieldWithPath("data.name").description("The name of the business sector."));
        fieldDescriptors.add(fieldWithPath("parent").description("The parent of the business sector."));
        fieldDescriptors.add(fieldWithPath("children").description("The child business sector."));
        return fieldDescriptors;
    }

    private List<FieldDescriptor> getBusinessSectorUpdateRequestFields() {
        List<FieldDescriptor> requestFields = new ArrayList<>();
        requestFields.add(fieldWithPath("name").description("The name of the business sector."));
        requestFields.add(fieldWithPath("parentId").description("The ID of the parent business sector."));
        return requestFields;
    }

    private List<FieldDescriptor> getLookupBusinessSectorResponseFields() throws Exception {
        List<FieldDescriptor> fieldDescriptors = new ArrayList<>();
        fieldDescriptors.add(fieldWithPath("content").description("An array of the lookups."));
        fieldDescriptors.add(fieldWithPath("content[].id").description("The ID of the lookup"));
        fieldDescriptors.add(fieldWithPath("content[].name").description("The name of the lookup"));
        fieldDescriptors.addAll(this.getPageableDescriptors());
        return fieldDescriptors;
    }
}
