package com.opencbs.loans.xml.sepa;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import lombok.Data;

@Data
@JacksonXmlRootElement(localName = "CstmrPmtStsRpt")
public class CustomerPaymentStatusReport {

    @JacksonXmlProperty(localName = "GrpHdr")
    private ImportGroupHeader groupHeader;

    @JacksonXmlProperty(localName = "OrgnlGrpInfAndSts")
    private OriginalGroupInformationAndStatus originalGroupInformationAndStatus;

    @JacksonXmlProperty(localName = "OrgnlPmtInfAndSts")
    private OriginalPaymentInformationAndStatus originalPaymentInformationAndStatus;
}
