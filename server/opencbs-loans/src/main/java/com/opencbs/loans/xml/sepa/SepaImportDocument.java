package com.opencbs.loans.xml.sepa;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.Data;

@Data
@JacksonXmlRootElement(localName = "Document")
public class SepaImportDocument {

    @JacksonXmlProperty(localName = "CstmrPmtStsRpt")
    private CustomerPaymentStatusReport customerPaymentStatusReport;

    @JacksonXmlProperty(isAttribute = true, localName = "xmlns")
    private String xmlns;

    @JacksonXmlProperty(isAttribute = true, localName = "xsi:schemaLocation")
    private String schemaLocation;

    @JacksonXmlProperty(isAttribute = true, localName = "xmlns:xsi")
    private String xmlXsi;
}
