package com.opencbs.core.apidoc;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.opencbs.core.domain.trees.Location;
import com.opencbs.core.dto.UpdateTreeEntityDto;
import com.opencbs.core.services.LocationService;
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
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.put;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.requestFields;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
@ActiveProfiles("test")
public class LocationDocumentationTest extends BaseDocumentationTest {

    private static final String ENDPOINT = "/api/locations";

    private String authHeader;

    @Autowired
    private LocationService locationService;

    @Before
    @Override
    public void setup() throws Exception {
        super.setup();
        this.authHeader = this.login();
    }

    @Test
    public void getLocation() throws Exception {
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("name", "Mozambique");
        attributes.put("parent", null);
        this.createLocation(attributes);

        this.mockMvc
                .perform(
                        get(ENDPOINT + "/1")
                                .header("Authorization", this.authHeader)
                                .accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "locations-getOne-example",
                                responseFields(this.getLocationResponseFields())
                        )
                );
    }

    @SuppressWarnings("unused")
    private class IgnoreMask {
        @JsonIgnore
        private long id;
    }

    @Test
    public void createLocation() throws Exception {
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("name", "Nepal");
        attributes.put("parent", null);
        UpdateTreeEntityDto location = this.mapToLocation(attributes);
        this.mockMvc.perform(
                post(ENDPOINT)
                        .header("Authorization", this.authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(this.asJson(location, LocationDocumentationTest.IgnoreMask.class)))
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "locations-create-example",
                                requestFields(this.getLocationUpdateRequestFields()),
                                responseFields(this.getLocationResponseFields())
                        )
                );
    }

    @Test
    public void createChildrenLocation() throws Exception {
        Map<String, Object> dataChild1 = new HashMap<>();
        dataChild1.put("id", 2L);
        dataChild1.put("name", "Kathmandu");
        dataChild1.put("parent", 1L);

        Map<String, Object> dataParent = new HashMap<>();
        dataParent.put("id", 1L);
        dataParent.put("name", "Nepal");
        this.createLocation(dataParent);

        UpdateTreeEntityDto location = this.mapToLocation(dataChild1);
        this.mockMvc.perform(
                post(ENDPOINT)
                        .header("Authorization", this.authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(this.asJson(location, LocationDocumentationTest.IgnoreMask.class)))
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "locations-children-create-example",
                                requestFields(this.getLocationUpdateRequestFields()),
                                responseFields(this.getLocationResponseFields())
                        )
                );
    }

    @Test
    public void updateCompany() throws Exception {
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("name", "Nepal");
        this.createLocation(attributes);

        attributes.put("name", "Pakistan");
        UpdateTreeEntityDto location = this.mapToLocation(attributes);

        this.mockMvc.perform(
                put(ENDPOINT + "/1")
                        .header("Authorization", this.authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(this.asJson(location, LocationDocumentationTest.IgnoreMask.class)))
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "locations-update-example",
                                requestFields(this.getLocationUpdateRequestFields()),
                                responseFields(this.getLocationResponseFields())
                        )
                );
    }

    @Test
    public void getLocationLookup() throws Exception {
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("name", "Cairo");
        this.createLocation(attributes);

        this.mockMvc
                .perform(
                        get(ENDPOINT + "/lookup")
                                .header("Authorization", this.authHeader)
                                .accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "location-getOne-lookup-example",
                                responseFields(this.getLookupLocationsResponseFields())

                        )
                );
    }

    private void createLocation(Map<String, Object> attributes) {
        Location location = new Location();
        location.setName((String) attributes.get("name"));
        location.setParent((Location) attributes.get("parent"));
        this.locationService.create(location);
    }

    private UpdateTreeEntityDto mapToLocation(Map<String, Object> attributes) {
        UpdateTreeEntityDto location = new UpdateTreeEntityDto();
        location.setName((String) attributes.get("name"));
        location.setParentId((Long) attributes.get("parent"));
        return location;
    }

    private List<FieldDescriptor> getLocationUpdateRequestFields() {
        List<FieldDescriptor> requestFields = new ArrayList<>();
        requestFields.add(fieldWithPath("name").description("The name of location."));
        requestFields.add(fieldWithPath("parentId").description("The ID of the parent location."));
        return requestFields;
    }

    private List<FieldDescriptor> getLocationResponseFields() {
        List<FieldDescriptor> responseFields = new ArrayList<>();
        responseFields.add(fieldWithPath("data").description("The data of the location."));
        responseFields.add(fieldWithPath("data.id").description("The ID of the location."));
        responseFields.add(fieldWithPath("data.name").description("The name of the location."));
        responseFields.add(fieldWithPath("parent").description("The parent of the location."));
        responseFields.add(fieldWithPath("children").description("The child locations."));
        return responseFields;
    }

    private List<FieldDescriptor> getLookupLocationsResponseFields() {
        List<FieldDescriptor> responseFields = new ArrayList<>();
        responseFields.add(fieldWithPath("content").description("The array of lookups."));
        responseFields.add(fieldWithPath("content[].id").description("The ID of the lookup."));
        responseFields.add(fieldWithPath("content[].name").description("The name of the lookup."));
        responseFields.addAll(this.getPageableDescriptors());
        return responseFields;
    }
}