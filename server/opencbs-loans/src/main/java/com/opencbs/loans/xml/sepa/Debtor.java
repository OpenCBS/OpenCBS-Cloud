package com.opencbs.loans.xml.sepa;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Data;

@Data
public class Debtor {

    @JacksonXmlProperty(localName = "Nm")
    private String name;

    @JacksonXmlProperty(localName = "PstlAdr")
    private PostalAddress postalAddress;
}
