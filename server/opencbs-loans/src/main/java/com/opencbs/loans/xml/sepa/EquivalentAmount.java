package com.opencbs.loans.xml.sepa;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Data;

@Data
public class EquivalentAmount {

    @JacksonXmlProperty(localName = "Amt")
    private InstructedAmount instructedAmount;

    @JacksonXmlProperty(localName = "CcyOfTrf")
    private String currencyOfTransfer;
}
