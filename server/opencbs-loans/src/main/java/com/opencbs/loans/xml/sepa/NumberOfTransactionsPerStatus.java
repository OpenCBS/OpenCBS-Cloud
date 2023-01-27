package com.opencbs.loans.xml.sepa;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class NumberOfTransactionsPerStatus {

    @JacksonXmlProperty(localName = "DtldNbOfTxs")
    private Integer detailedNumberOfTransactions;

    @JacksonXmlProperty(localName = "DtldSts")
    private String detailedStatus;

    @JacksonXmlProperty(localName = "DtldCtrlSum")
    private BigDecimal detailedControlSum;
}
