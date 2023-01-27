package com.opencbs.loans.xml.sepa;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Data;

@Data
public class OriginalGroupInformationAndStatus {

    @JacksonXmlProperty(localName = "OrgnlMsgId")
    private String originalMessageIdentification;

    @JacksonXmlProperty(localName = "OrgnlMsgNmId")
    private String originalMessageNameIdentification;

    @JacksonXmlProperty(localName = "StsRsnInf")
    private StatusReasonInformation statusReasonInformation;
}
