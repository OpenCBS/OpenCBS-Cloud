package com.opencbs.loans.xml.sepa;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class DirectDebitTransactionInformation {

    @JacksonXmlProperty(localName = "PmtId")
    private PaymentIdentification paymentIdentification;

    @JacksonXmlProperty(localName = "InstdAmt")
    private InstructedAmount instructedAmount;

    @JacksonXmlProperty(localName = "DrctDbtTx")
    private DirectDebitTransaction directDebitTransaction;

    @JacksonXmlProperty(localName = "DbtrAgt")
    private DebtorAgent debtorAgent;

    @JacksonXmlProperty(localName = "Dbtr")
    private Debtor debtor;

    @JacksonXmlProperty(localName = "DbtrAcct")
    private DebtorAccount debtorAccount;

    @JacksonXmlProperty(localName = "RmtInf")
    private RemittanceInformation remittanceInformation;
}
