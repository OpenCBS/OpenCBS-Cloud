package com.opencbs.loans.xml.sepa;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class PostalAddress {

    @JacksonXmlProperty(localName = "Ctry")
    private String country;

    @JacksonXmlProperty(localName = "AdrLine")
    private List<String> addressLine;
}
