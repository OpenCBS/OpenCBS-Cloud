package com.opencbs.core.apidoc;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.opencbs.core.domain.Payee;
import com.opencbs.core.services.PayeeService;
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
import java.util.List;

import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.requestFields;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class PayeeDocumentationTest extends BaseDocumentationTest {

    private static final String ENDPOINT = "/api/payees";

    private String authHeader;

    @Autowired
    private PayeeService payeeService;

    @Before
    @Override
    public void setup() throws Exception {
        super.setup();
        this.authHeader = this.login();
    }

    @Test
    public void getPayees() throws Exception {
        this.createPayees();
        this.mockMvc
                .perform(
                        get(ENDPOINT + "/1")
                                .header("Authorization", this.authHeader)
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "payee-getOne-example",
                                responseFields(this.getPayeeResponseFields())
                        )
                );
    }

    @SuppressWarnings("unused")
    private class IgnoreMask {
        @JsonIgnore
        private long id;
    }

    @Test
    public void postPayee() throws Exception {
        Payee payee = this.createPayees();
        payee.setName("New payee");
        this.mockMvc
                .perform(
                        post(ENDPOINT)
                                .header("Authorization", this.authHeader)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(this.asJson(payee, PayeeDocumentationTest.IgnoreMask.class))
                )
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "payee-create-example",
                                responseFields(this.getPayeeResponseFields()),
                                requestFields(this.getPayeeRequestFields())
                        )
                );
    }

    @Test
    public void updatePayee() throws Exception {
        Payee payee = this.createPayees();
        payee.setName("Link kg");
        this.mockMvc
                .perform(
                        put(ENDPOINT + "/1")
                                .header("Authorization", this.authHeader)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(this.asJson(payee, PayeeDocumentationTest.IgnoreMask.class))
                )
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "payee-update-example",
                                responseFields(this.getPayeeResponseFields()),
                                requestFields(this.getPayeeRequestFields())
                        )
                );
    }

    public Payee createPayees() {
        Payee payee = new Payee();
        payee.setName("Name");
        payee.setId(1L);
        payee.setDescription("Description");
        return this.payeeService.create(payee);
    }

    public List<FieldDescriptor> getPayeeResponseFields() {
        List<FieldDescriptor> response = new ArrayList<>();
        response.add(fieldWithPath("id").description("The ID of the payee."));
        response.addAll(getPayeeRequestFields());
        return response;
    }

    public List<FieldDescriptor> getPayeeRequestFields() {
        List<FieldDescriptor> response = new ArrayList<>();
        response.add(fieldWithPath("name").description("The name of the payee."));
        response.add(fieldWithPath("description").description("The description of the payee."));
        return response;
    }
}
