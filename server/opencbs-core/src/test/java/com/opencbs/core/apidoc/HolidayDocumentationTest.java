package com.opencbs.core.apidoc;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.opencbs.core.domain.Holiday;
import com.opencbs.core.dto.HolidayDto;
import com.opencbs.core.mappers.HolidayMapper;
import com.opencbs.core.services.HolidayService;
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
public class HolidayDocumentationTest extends BaseDocumentationTest {

    private static final String ENDPOINT = "/api/holidays";

    private String authHeader;

    @Autowired
    private HolidayService holidayService;

    @Autowired
    private HolidayMapper holidayMapper;

    @Before
    @Override
    public void setup() throws Exception {
        super.setup();
        this.authHeader = this.login();
    }

    @Test
    public void getHoliday() throws Exception {
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("name", "New Year");
        attributes.put("date", "2017-01-01");
        attributes.put("annual", true);
        this.createHoliday(attributes);

        this.mockMvc
                .perform(
                        get(ENDPOINT + "/1")
                                .header("Authorization", this.authHeader)
                                .accept(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "holidays-getOne-example",
                                responseFields(this.getHolidayResponseFields())
                        )
                );
    }

    @Test
    public void createHoliday() throws Exception {
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("name", "New Year");
        attributes.put("date", "2017-01-01");
        attributes.put("annual", true);
        HolidayDto holidayDto = this.mapToHolidayDto(attributes);
        this.mockMvc.perform(
                post(ENDPOINT)
                        .header("Authorization", this.authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(this.asJson(holidayDto, HolidayDocumentationTest.IgnoreMask.class)))
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "holidays-create-example",
                                requestFields(this.getHolidayFields()),
                                responseFields(this.getHolidayResponseFields())
                        )
                );
    }

    @Test
    public void updateHoliday() throws Exception {
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("name", "New Year");
        attributes.put("date", "2017-01-01");
        attributes.put("annual", true);
        this.createHoliday(attributes);

        attributes.put("name", "Nooruz");
        attributes.put("annual", false);
        attributes.put("date", "2017-03-21");
        HolidayDto location = this.mapToHolidayDto(attributes);

        this.mockMvc.perform(
                put(ENDPOINT + "/1")
                        .header("Authorization", this.authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(this.asJson(location, HolidayDocumentationTest.IgnoreMask.class)))
                .andExpect(status().isOk())
                .andDo(
                        document(
                                "holidays-update-example",
                                requestFields(this.getHolidayFields()),
                                responseFields(this.getHolidayResponseFields())
                        )
                );
    }

    @SuppressWarnings("unused")
    private class IgnoreMask {
        @JsonIgnore
        private long id;
    }

    private void createHoliday(Map<String, Object> attributes) {
        Holiday holiday = this.holidayMapper.mapToEntity(this.mapToHolidayDto(attributes));
        this.holidayService.create(holiday);
    }

    private List<FieldDescriptor> getHolidayResponseFields() {
        List<FieldDescriptor> responseFields = new ArrayList<>();
        responseFields.add(fieldWithPath("id").description("The ID of the holiday."));
        responseFields.addAll(this.getHolidayFields());
        return responseFields;
    }

    private List<FieldDescriptor> getHolidayFields() {
        List<FieldDescriptor> responseFields = new ArrayList<>();
        responseFields.add(fieldWithPath("name").description("The name of the holiday."));
        responseFields.add(fieldWithPath("date").description("The date of the holiday."));
        responseFields.add(fieldWithPath("annual").description("The mark of the annual holiday."));
        return responseFields;
    }

    private HolidayDto mapToHolidayDto(Map<String, Object> attributes) {
        HolidayDto holiday = new HolidayDto();
        holiday.setName((String) attributes.get("name"));
        holiday.setDate((String) attributes.get("date"));
        holiday.setAnnual((Boolean) attributes.get("annual"));
        return holiday;
    }
}
