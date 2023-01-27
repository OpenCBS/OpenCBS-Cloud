package com.opencbs.loans.services.sepaintegration;

import com.fasterxml.jackson.dataformat.xml.XmlFactory;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.accounting.services.AccountingEntryService;
import com.opencbs.core.domain.RepaymentSplit;
import com.opencbs.core.domain.RepaymentTypes;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.domain.LoanInstallment;
import com.opencbs.loans.domain.SepaDocument;
import com.opencbs.loans.domain.enums.SepaDocumentStatus;
import com.opencbs.loans.dto.sepaintegration.SepaDocumentUpdateForm;
import com.opencbs.loans.dto.sepaintegration.SepaIntegrationExportDto;
import com.opencbs.loans.dto.sepaintegration.SepaIntegrationImportDto;
import com.opencbs.loans.dto.sepaintegration.SepaRepaymentDto;
import com.opencbs.loans.mappers.sepa.SepaIntegrationMapper;
import com.opencbs.loans.services.LoanAccountingService;
import com.opencbs.loans.services.LoanService;
import com.opencbs.loans.services.repayment.LoanRepaymentService;
import com.opencbs.loans.services.repayment.LoanRepaymentServiceFactory;
import com.opencbs.loans.workers.LoanRepaymentWorker;
import com.opencbs.loans.xml.sepa.CustomerCreditTransferInitiation;
import com.opencbs.loans.xml.sepa.SepaExportDocument;
import com.opencbs.loans.xml.sepa.SepaImportDocument;
import io.jsonwebtoken.lang.Assert;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.xml.stream.XMLInputFactory;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class SepaIntegrationServiceImpl implements SepaIntegrationService{

    private final LoanService loanService;
    private final SepaDocumentService sepaDocumentService;
    private final LoanRepaymentServiceFactory loanRepaymentServiceFactory;
    private final LoanRepaymentWorker loanRepaymentWorker;
    private final AccountingEntryService accountingEntryService;
    private final LoanAccountingService loanAccountingService;
    private final AccountService accountService;
    private final SepaIntegrationMapper sepaIntegrationMapper;

    @Override
    public List<SepaIntegrationExportDto> getSepaIntegrationExportDtosByDate(LocalDate requiredDate) {
        List<SepaIntegrationExportDto> result = new ArrayList<>();
        User currentUser = UserHelper.getCurrentUser();
        List<Long> activeLoans = loanService.getActiveLoanIds(currentUser.getBranch());
        for (Long loanId : activeLoans){
            Optional<LoanInstallment> loanInstallmentOpt = loanService.getActiveLoanInstallmentByLoan(loanId, requiredDate);
            if (!loanInstallmentOpt.isPresent()) {
                continue;
            }
            LoanInstallment loanInstallment = loanInstallmentOpt.get();

            Loan loan = loanService.getLoanById(loanId);
            Profile profile = loan.getProfile();
            Optional<String> iban = sepaIntegrationMapper.getValueFromCustomFieldsByName("new_iban", profile);
            if (!iban.isPresent()) {
                iban = sepaIntegrationMapper.getValueFromCustomFieldsByName("iban", profile);
            }

            SepaIntegrationExportDto sepaIntegrationExportDto = SepaIntegrationExportDto
                    .builder()
                    .profileName(loan.getProfile().getName())
                    .code(loan.getCode())
                    .date(requiredDate)
                    .interest(loanInstallment.getInterest())
                    .principal(loanInstallment.getPrincipal())
                    .iban(iban.orElse("NO_IBAN_FOUND_ON_THIS_PROFILE"))
                    .build();

            result.add(sepaIntegrationExportDto);
        }

        return result;
    }

    @Override
    public String getSepaExportXML(List<String> codes, LocalDate requiredDate) {
        List<Loan> requiredLoans = loanService.getAllLoansByCodeIn(codes);

        SepaExportDocument sepaExportDocument = new SepaExportDocument();
        CustomerCreditTransferInitiation customerCreditTransferInitiation = new CustomerCreditTransferInitiation();

        customerCreditTransferInitiation.setGroupHeader(sepaIntegrationMapper.generateXmlGroupHeader(requiredLoans, requiredDate));
        customerCreditTransferInitiation.setPaymentInfo(sepaIntegrationMapper.generateXmlPaymentInformation(requiredLoans, requiredDate));

        sepaExportDocument.setCustomerCreditTransferInitiation(customerCreditTransferInitiation);

        String xmlResponse = "";
        try{
            XmlMapper xmlMapper = new XmlMapper();
            xmlResponse =  xmlMapper.writeValueAsString(sepaExportDocument);
            SepaDocument sepaDocument = sepaDocumentService.create(
                    sepaIntegrationMapper.getSepaDocumentExportCreateForm(customerCreditTransferInitiation));
            Assert.isTrue(Objects.nonNull(sepaDocument), "Could not create SEPA document record");
        }catch (IOException e){
            log.error(e.getLocalizedMessage());
        }

        return xmlResponse;
    }

    @Override
    public SepaRepaymentDto uploadAndParseXMLFile(MultipartFile importFile) {
        XmlMapper xmlMapper;
        SepaRepaymentDto resultDto = new SepaRepaymentDto(new ArrayList<>(), "");

        SepaImportDocument sepaImportDocument;
        try{
            XmlFactory xmlFactory = new XmlFactory();
            XMLInputFactory inputFactory = XMLInputFactory.newFactory();
            inputFactory.setProperty("javax.xml.stream.isNamespaceAware", false);
            xmlFactory.setXMLInputFactory(inputFactory);
            xmlMapper = new XmlMapper(xmlFactory);

            sepaImportDocument = xmlMapper.readValue(importFile.getBytes(), SepaImportDocument.class);

            Assert.isTrue(sepaImportDocument.getXmlns().equals("urn:iso:std:iso:20022:tech:xsd:pain.002.001.03"),
                    "Wrong namespace for import SEPA file");

            if (Objects.isNull(sepaImportDocument.getCustomerPaymentStatusReport()) ||
                    Objects.isNull(sepaImportDocument.getCustomerPaymentStatusReport().getOriginalPaymentInformationAndStatus())) {
                log.error("Wrong data in SEPA import file");
            }

            String documentCode = sepaImportDocument.getCustomerPaymentStatusReport().getGroupHeader().getMessageId();
            Assert.isTrue(Objects.isNull(sepaDocumentService.getDocumentByCode(documentCode)),
                    String.format("SEPA file with uid %s already uploaded", documentCode));

            resultDto.setData(sepaIntegrationMapper.parseUploadedDataToImportDto(sepaImportDocument
                    .getCustomerPaymentStatusReport()
                    .getOriginalPaymentInformationAndStatus()
                    .getTransactionInformationAndStatusList()));

            SepaDocument sepaDocument = sepaDocumentService.create(
                    sepaIntegrationMapper.getSepaDocumentImportCreateForm(sepaImportDocument.getCustomerPaymentStatusReport()));
            Assert.isTrue(Objects.nonNull(sepaDocument), "Could not create SEPA document record");
            resultDto.setDocumentUid(sepaDocument.getUid());
        } catch (IOException e) {
            e.printStackTrace();
        }

        return resultDto;
    }

    @Transactional
    @Override
    public void sepaRepayment(SepaRepaymentDto repaymentDto) {
        List<RepaymentSplit> splitList = new ArrayList<>();

        LocalDateTime timestamp = DateHelper.getLocalDateTimeNow();
        for (SepaIntegrationImportDto item : repaymentDto.getData()) {
            RepaymentSplit repaymentSplit = new RepaymentSplit();

            repaymentSplit.setId(item.getLoanId());
            repaymentSplit.setTimestamp(timestamp);
            repaymentSplit.setRepaymentType(RepaymentTypes.NORMAL_REPAYMENT);
            repaymentSplit.setTotal(item.getAmount());

            splitList.add(repaymentSplit);
            AccountingEntry accountingEntry = createAccountingEntryForSepaRepayment(
                    DateHelper.convertStringToLocalDate(item.getDate()).atStartOfDay(), item.getAmount(), item.getLoanId());
            Assert.isTrue(Objects.nonNull(accountingEntry), "Could not create accounting entry for: " + item.getCode());
        }

        if (!makeRepaymentBySplitList(splitList)) {
            updateSepaDocument(repaymentDto.getDocumentUid(), SepaDocumentStatus.FAILED);
        }
        updateSepaDocument(repaymentDto.getDocumentUid(), SepaDocumentStatus.REPAID);
    }

    private Boolean makeRepaymentBySplitList(List<RepaymentSplit> splitList){
        LoanRepaymentService loanRepaymentService = loanRepaymentServiceFactory.getLoanRepaymentService(RepaymentTypes.NORMAL_REPAYMENT);
        try {
            for (RepaymentSplit item : splitList) {
                RepaymentSplit repaymentSplit = loanRepaymentService.split(item.getId(), item);
                repaymentSplit.setId(item.getId());
                loanRepaymentWorker.makeRepayment(repaymentSplit);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Boolean.FALSE;
        }

        return Boolean.TRUE;
    }

    private AccountingEntry createAccountingEntryForSepaRepayment(LocalDateTime effectiveAt, BigDecimal amount, Long loanId){
        Loan loan = loanService.getLoanById(loanId);
        Assert.isTrue(Objects.nonNull(loan), "No loan found with ID " + loanId.toString());

        Account creditAccount = loanAccountingService.getCurrentAccountFromLoan(loan);
        Optional<Account> debitAccountOpt = accountService.findByNumber("50050011");
        Assert.isTrue(debitAccountOpt.isPresent(), "No debit account found for SEPA");

        AccountingEntry accountingEntry = accountingEntryService.getAccountingEntry(
                effectiveAt, amount, debitAccountOpt.get(), creditAccount, loan.getBranch(), "SEPA repayment", UserHelper.getCurrentUser(), null);

        return accountingEntryService.create(accountingEntry);
    }

    private void updateSepaDocument(String documentCode, SepaDocumentStatus newStatus){
        SepaDocument sepaDocument = sepaDocumentService.getDocumentByCode(documentCode);
        Assert.isTrue(Objects.nonNull(sepaDocument), "No SEPA document found to update");
        sepaDocumentService.update(sepaDocument, new SepaDocumentUpdateForm(newStatus));
    }
}
