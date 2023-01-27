package com.opencbs.loans.xml.sepa;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.Data;

@Data
@JacksonXmlRootElement(localName = "Document")
public class SepaExportDocument {

    @JacksonXmlProperty(localName = "CstmrDrctDbtInitn")
    private CustomerCreditTransferInitiation customerCreditTransferInitiation;

    @JacksonXmlProperty(isAttribute = true, localName = "xmlns")
    private final String xmlns = "urn:iso:std:iso:20022:tech:xsd:pain.008.001.02";

    @JacksonXmlProperty(isAttribute = true, localName = "xsi:schemaLocation")
    private final String schemaLocation = "urn:iso:std:iso:20022:tech:xsd:pain.008.001.02 pain.008.001.02.xsd";

    @JacksonXmlProperty(isAttribute = true, localName = "xmlns:xsi")
    private final String xmlnsXsi = "http://www.w3.org/2001/XMLSchema-instance";
}
