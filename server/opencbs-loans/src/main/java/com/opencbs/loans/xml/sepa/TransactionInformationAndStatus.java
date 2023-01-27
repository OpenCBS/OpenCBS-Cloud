package com.opencbs.loans.xml.sepa;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Data;

@Data
public class TransactionInformationAndStatus {

    @JacksonXmlProperty(localName = "StsId")
    private String statusIdentification;

    @JacksonXmlProperty(localName = "OrgnlInstrId")
    private String originalInstructionIdentificationl;

    @JacksonXmlProperty(localName = "OrgnlEndToEndId")
    private String originalEndToEndIdentification;

    @JacksonXmlProperty(localName = "TxSts")
    private String transactionStatus;

    @JacksonXmlProperty(localName = "StsRsnInf")
    private StatusReasonInformation statusReasonInformation;

    @JacksonXmlProperty(localName = "OrgnlTxRef")
    private OriginalTransactionReference originalTransactionReference;
}
