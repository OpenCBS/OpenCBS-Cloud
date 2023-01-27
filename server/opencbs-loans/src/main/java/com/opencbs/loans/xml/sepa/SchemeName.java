package com.opencbs.loans.xml.sepa;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Data;

@Data
public class SchemeName {

    @JacksonXmlProperty(localName = "Prtry")
    private String proprietary;
}
