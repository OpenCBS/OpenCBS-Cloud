package com.opencbs.loans.xml.sepa;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class Other {

    @JacksonXmlProperty(localName = "Id")
    private String identification;

    @JacksonXmlProperty(localName = "SchmeNm")
    private SchemeName schemeName;
}
