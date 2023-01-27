package com.opencbs.core.apidoc;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.opencbs.core.domain.trees.Profession;
import com.opencbs.core.dto.UpdateTreeEntityDto;
import com.opencbs.core.services.ProfessionService;
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
public class ProfessionDocumentationTest extends BaseDocumentationTest {

    private static final String ENDPOINT = "/api/professions";

    private String authHeader;

    @Autowired
    private ProfessionService professionService;

    @Before
    @Override
    public void setup() throws Exception {
        super.setup();
        this.authHeader = this.login();
    }

    @Test
    public void getProfession() throws Exception {
        Map<String, Object> data = new HashMap<>();
        data.put("name", "Plumber");
        data.put("parent", null);
        this.createProfession(data);

        this.mockMvc
                .perform(
                        get(ENDPOINT + "/1")
                                .header("Authorization", this.authHeader)
                                .accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "profession-getOne-example",
                                responseFields(this.getProfessionResponseFields())
                        )
                );
    }

    @Test
    public void createProfession() throws Exception {
        Map<String, Object> data = new HashMap<>();
        data.put("name", "Doctor");
        data.put("parentId", null);
        UpdateTreeEntityDto profession = this.mapToProfession(data);
        this.mockMvc
                .perform(
                        post(ENDPOINT)
                                .header("Authorization", this.authHeader)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(asJson(profession, ProfessionDocumentationTest.IgnoreMask.class))

                )
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "profession-create-example",
                                requestFields(this.getProfessionUpdateRequestFields()),
                                responseFields(this.getProfessionResponseFields())
                        )
                );
    }

    @Test
    public void createChildrenProfession() throws Exception {
        Map<String, Object> dataChild = new HashMap<>();
        dataChild.put("id", 2L);
        dataChild.put("name", "Driver");
        dataChild.put("parentId", 1L);

        Map<String, Object> parent = new HashMap<>();
        parent.put("id", 1L);
        parent.put("name", "Nurse");
        this.createProfession(parent);

        UpdateTreeEntityDto profession = this.mapToProfession(dataChild);
        this.mockMvc
                .perform(
                        post(ENDPOINT)
                                .header("Authorization", this.authHeader)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(asJson(profession, ProfessionDocumentationTest.IgnoreMask.class))

                )
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "profession-children-create-example",
                                requestFields(this.getProfessionUpdateRequestFields()),
                                responseFields(this.getProfessionResponseFields())
                        )
                );
    }

    @Test
    public void updateProfession() throws Exception {
        Map<String, Object> data = new HashMap<>();
        data.put("name", "Architect");
        this.createProfession();

        data.put("name", "Mechanic");
        UpdateTreeEntityDto profession = this.mapToProfession(data);
        this.mockMvc
                .perform(
                        post(ENDPOINT)
                                .header("Authorization", this.authHeader)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(asJson(profession, ProfessionDocumentationTest.IgnoreMask.class))

                )
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "profession-update-example",
                                requestFields(this.getProfessionUpdateRequestFields()),
                                responseFields(this.getProfessionResponseFields())
                        )
                );
    }

    @SuppressWarnings("unused")
    private class IgnoreMask {
        @JsonIgnore
        private long id;
    }

    private void createProfession(Map<String, Object> data) throws Exception {
        Profession profession = new Profession();
        profession.setName((String) data.get("name"));
        profession.setParent((Profession) data.get("parent"));
        this.professionService.create(profession);
    }

    private UpdateTreeEntityDto mapToProfession(Map<String, Object> data) throws Exception {
        UpdateTreeEntityDto profession = new UpdateTreeEntityDto();
        profession.setName((String) data.get("name"));
        profession.setParentId((Long) data.get("parentId"));
        return profession;
    }

    private List<FieldDescriptor> getProfessionUpdateRequestFields() {
        List<FieldDescriptor> requestFields = new ArrayList<>();
        requestFields.add(fieldWithPath("name").description("The name of the profession."));
        requestFields.add(fieldWithPath("parentId").description("The ID of the parent profession."));
        return requestFields;
    }

    private List<FieldDescriptor> getProfessionResponseFields() {
        List<FieldDescriptor> fieldDescriptors = new ArrayList<>();
        fieldDescriptors.add(fieldWithPath("data").description("The data of the profession."));
        fieldDescriptors.add(fieldWithPath("data.id").description("The ID of the profession."));
        fieldDescriptors.add(fieldWithPath("data.name").description("The name of the profession."));
        fieldDescriptors.add(fieldWithPath("parent").description("The parent of the profession."));
        fieldDescriptors.add(fieldWithPath("children").description("The child profession."));
        return fieldDescriptors;
    }
}
