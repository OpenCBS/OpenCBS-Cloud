package com.opencbs.core.apidoc;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.restdocs.payload.FieldDescriptor;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;
import java.util.List;

import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.get;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class GlobalSettingsDocumentationTest  extends BaseDocumentationTest {
    private static final String ENDPOINT = "/api/global-settings";
    private String authHeader;

    @Before
    @Override
    public void setup() throws Exception {
        super.setup();
        this.authHeader = this.login();
    }

    @Test
    public void getGlobalSettings() throws Exception {
        this.mockMvc
                .perform(
                        get(ENDPOINT+"/USE_MAKER_AND_CHECKER")
                                .header("Authorization", this.authHeader)
                                .accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "global-settings-getOne-example",
                                responseFields(this.getGlobalSettingsFields())
                        )
                );
    }

    private List<FieldDescriptor> getGlobalSettingsFields() {
        List<FieldDescriptor> responseFields = new ArrayList<>();
        responseFields.add(fieldWithPath("name").description("The name of the global setting"));
        responseFields.add(fieldWithPath("type").description("The type of the global setting"));
        responseFields.add(fieldWithPath("value").description("The value of the global setting"));
        return responseFields;
    }
}
