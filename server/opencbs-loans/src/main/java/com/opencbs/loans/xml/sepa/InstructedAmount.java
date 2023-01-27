package com.opencbs.loans.xml.sepa;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlText;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class InstructedAmount {

    @JacksonXmlProperty(isAttribute = true, localName = "Ccy")
    private String currency;

    @JacksonXmlText
    private BigDecimal amount;
}
