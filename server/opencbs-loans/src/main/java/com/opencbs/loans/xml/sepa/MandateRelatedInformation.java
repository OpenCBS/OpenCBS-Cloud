package com.opencbs.loans.xml.sepa;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.Data;

import java.time.LocalDate;

@Data
public class MandateRelatedInformation {

    @JacksonXmlProperty(localName = "MndtId")
    private String mandateIdentification;

    @JacksonXmlProperty(localName = "DtOfSgntr")
    private String dateOfSignature;

    @JacksonXmlProperty(localName = "AmdmntInd")
    private Boolean amendmentIndicator;
}
