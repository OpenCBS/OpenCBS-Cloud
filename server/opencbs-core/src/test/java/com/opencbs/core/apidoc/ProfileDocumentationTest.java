package com.opencbs.core.apidoc;

import com.opencbs.core.domain.User;
import com.opencbs.core.domain.customfields.CompanyCustomFieldValue;
import com.opencbs.core.domain.profiles.Company;
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
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class ProfileDocumentationTest extends BaseDocumentationTest {

    private static final String ENDPOINT = "/api/profiles";

    private String authHeader;

    @Autowired
    private CompanyService companyService;

    @Autowired
    private UserService userService;

    @Autowired
    private CompanyCustomFieldService companyCustomFieldService;

    @Before
    @Override
    public void setup() throws Exception {
        super.setup();
        this.authHeader = this.login();
    }

    @Test
    public void getProfile() throws Exception {
        this.createProfile();
        this.mockMvc
                .perform(
                        get(ENDPOINT)
                                .header("Authorization", this.authHeader)
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "profile-getOne-example",
                                responseFields(this.getProfileResponseFields()))
                );
    }

    private void createProfile() throws ResourceNotFoundException {
        Company profile = new Company();
        profile.setAttachments(null);
        profile.setName("Microsoft");
        profile.setCreatedAt(DateHelper.getLocalDateTimeNow());
        profile.setCreatedBy(this.userService.findById(1L).get());

        List<CompanyCustomFieldValue> customFieldValues = this.companyCustomFieldService.findAll()
                .stream()
                .map(cf -> {
                    CompanyCustomFieldValue customFieldValue = new CompanyCustomFieldValue();
                    customFieldValue.setValue("1");
                    customFieldValue.setCustomField(cf);
                    customFieldValue.setOwner(profile);
                    return customFieldValue;
                })
                .collect(Collectors.toList());
        profile.setCustomFieldValues(customFieldValues);
        User user = new User();
        user.setId(1L);
        this.companyService.create(profile, user, true);
    }

    public List<FieldDescriptor> getProfileResponseFields() {
        List<FieldDescriptor> descriptors = new ArrayList<>();
        descriptors.add(fieldWithPath("content[].id").description("The ID of profile."));
        descriptors.add(fieldWithPath("content[].status").description("The status of profile"));
        descriptors.add(fieldWithPath("content[].type").description("The type of profile."));
        descriptors.add(fieldWithPath("content[].name").description("The name of profile."));
        descriptors.add(fieldWithPath("content[].createdAt").description("The created date and time of profile."));
        descriptors.add(fieldWithPath("content[].createdBy.id").description("The ID of profile creator."));
        descriptors.add(fieldWithPath("content[].createdBy.username").description("The username of profile creator."));
        descriptors.add(fieldWithPath("content[].createdBy.firstName").description("The first name of profile creator."));
        descriptors.add(fieldWithPath("content[].createdBy.lastName").description("The last name of profile creator."));
        descriptors.add(fieldWithPath("content[].createdBy.roleId").description("The role ID of profile creator."));
        descriptors.add(fieldWithPath("content[].createdBy.roleName").description("The role name of profile creator."));
        descriptors.add(fieldWithPath("last").description("The existence of the last page."));
        descriptors.add(fieldWithPath("totalPages").description("The existence of the last page."));
        descriptors.add(fieldWithPath("totalElements").description("The total number of elements."));
        descriptors.add(fieldWithPath("sort").description("The type of sorting."));
        descriptors.add(fieldWithPath("first").description("The first element.")); //ask form Pavel
        descriptors.add(fieldWithPath("numberOfElements").description("The number of elements in one page."));
        descriptors.add(fieldWithPath("size").description("The maximum number of elements on one page."));
        descriptors.add(fieldWithPath("number").description("The number of elements.")); //ask
        return descriptors;
    }
}
