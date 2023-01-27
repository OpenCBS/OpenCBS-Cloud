package com.opencbs.loans.xml.sepa;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Data;

@Data
public class PaymentIdentification {

    @JacksonXmlProperty(localName = "InstrId")
    private String instructionIdentification;

    @JacksonXmlProperty(localName = "EndToEndId")
    private String endToEndIdentification;
}
