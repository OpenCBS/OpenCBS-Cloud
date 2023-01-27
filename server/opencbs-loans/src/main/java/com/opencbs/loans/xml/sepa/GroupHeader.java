package com.opencbs.loans.xml.sepa;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Data;

import java.math.BigDecimal;

@Data
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class GroupHeader {

    @JacksonXmlProperty(localName = "MsgId")
    private String messageId;

    @JacksonXmlProperty(localName = "CreDtTm")
    private String createdDateTime;

    @JacksonXmlProperty(localName = "NbOfTxs")
    private Integer numberOfTransactions;

    @JacksonXmlProperty(localName = "CtrlSum")
    private BigDecimal controlSum;

    @JacksonXmlProperty(localName = "InitgPty")
    private InitiatingParty initiatingParty;
}
