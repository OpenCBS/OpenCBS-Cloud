package com.opencbs.loans.xml.sepa;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class CustomerCreditTransferInitiation {

    @JacksonXmlProperty(localName = "GrpHdr")
    private GroupHeader groupHeader;

    @JacksonXmlProperty(localName = "PmtInf")
    private PaymentInfo paymentInfo;

}
