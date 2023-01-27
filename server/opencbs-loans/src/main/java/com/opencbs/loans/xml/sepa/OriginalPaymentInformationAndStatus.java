package com.opencbs.loans.xml.sepa;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class OriginalPaymentInformationAndStatus {

    @JacksonXmlProperty(localName = "OrgnlPmtInfId")
    private String originalPaymentInformationIdentification;

    @JacksonXmlProperty(localName = "OrgnlNbOfTxs")
    private Integer originalNumberOfTransactions;

    @JacksonXmlProperty(localName = "OrgnlCtrlSum")
    private BigDecimal originalControlSum;

    @JacksonXmlProperty(localName = "PmtInfSts")
    private String paymentInformationStatus;

    @JacksonXmlProperty(localName = "NbOfTxsPerSts")
    @JacksonXmlElementWrapper(useWrapping = false)
    private List<NumberOfTransactionsPerStatus> numberOfTransactionsPerStatusList;

    @JacksonXmlProperty(localName = "TxInfAndSts")
    @JacksonXmlElementWrapper(useWrapping = false)
    private List<TransactionInformationAndStatus> transactionInformationAndStatusList;
}
