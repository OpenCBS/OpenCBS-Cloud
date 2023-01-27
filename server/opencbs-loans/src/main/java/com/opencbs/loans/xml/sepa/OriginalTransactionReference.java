package com.opencbs.loans.xml.sepa;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Data;

import java.time.LocalDate;

@Data
public class OriginalTransactionReference {

    @JacksonXmlProperty(localName = "Amt")
    private Amount amount;

    @JacksonXmlProperty(localName = "ReqdColltnDt")
    private String requestedCollectionDate;

    @JacksonXmlProperty(localName = "CdtrSchmeId")
    private CreditorSchemeIdentification creditorSchemeIdentification;

    @JacksonXmlProperty(localName = "MndtRltdInf")
    private MandateRelatedInformation mandateRelatedInformation;

    @JacksonXmlProperty(localName = "RmtInf")
    private RemittanceInformation remittanceInformation;

    @JacksonXmlProperty(localName = "Dbtr")
    private Debtor debtor;

    @JacksonXmlProperty(localName = "DbtrAcct")
    private DebtorAccount debtorAccount;
}
