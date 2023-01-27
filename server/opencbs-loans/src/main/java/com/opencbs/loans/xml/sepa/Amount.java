package com.opencbs.loans.xml.sepa;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Data;

@Data
public class Amount {

    @JacksonXmlProperty(localName = "InstdAmt")
    private InstructedAmount instructedAmount;

    @JacksonXmlProperty(localName = "EqvtAmt")
    private EquivalentAmount equivalentAmount;

}
