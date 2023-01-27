package com.opencbs.loans.xml.sepa;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class ImportGroupHeader {

    @JacksonXmlProperty(localName = "MsgId")
    private String messageId;

    @JacksonXmlProperty(localName = "CreDtTm")
    private String createdDateTime;

    @JacksonXmlProperty(localName = "InitgPty")
    private ImportInitiatingParty initiatingParty;
}
