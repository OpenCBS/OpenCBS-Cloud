package com.opencbs.loans.xml.sepa;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class PaymentInfo {

    @JacksonXmlProperty(localName = "PmtInfId")
    private String paymentInfoId;

    @JacksonXmlProperty(localName = "PmtMtd")
    private String paymentMethod;

    @JacksonXmlProperty(localName = "BtchBookg")
    private Boolean batchBooking;

    @JacksonXmlProperty(localName = "NbOfTxs")
    private Integer numberOfTransactions;

    @JacksonXmlProperty(localName = "CtrlSum")
    private BigDecimal controlSum;

    @JacksonXmlProperty(localName = "PmtTpInf")
    private PaymentTypeInformation paymentTypeInformation;

    @JacksonXmlProperty(localName = "ReqdColltnDt")
    private String requiredDate;

    @JacksonXmlProperty(localName = "Cdtr")
    private Creditor creditor;

    @JacksonXmlProperty(localName = "CdtrAcct")
    private CreditorAccount creditorAccount;

    @JacksonXmlProperty(localName = "CdtrAgt")
    private CreditorAgent creditorAgent;

    @JacksonXmlProperty(localName = "ChrgBr")
    private String chargeBearer;

    @JacksonXmlProperty(localName = "CdtrSchmeId")
    private CreditorSchemeIdentification creditorSchemeIdentification;

    @JacksonXmlProperty(localName = "DrctDbtTxInf")
    private List<DirectDebitTransactionInformation> directDebitTransactionInformationList;

}
