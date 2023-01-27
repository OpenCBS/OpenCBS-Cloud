package com.opencbs.loans.mappers.sepa;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.customfields.CustomFieldValue;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.services.CompanyService;
import com.opencbs.core.services.CurrencyService;
import com.opencbs.core.services.GroupService;
import com.opencbs.core.services.PersonService;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.domain.LoanInstallment;
import com.opencbs.loans.domain.enums.SepaDocumentStatus;
import com.opencbs.loans.domain.enums.SepaDocumentType;
import com.opencbs.loans.dto.sepaintegration.SepaDocumentCreateForm;
import com.opencbs.loans.dto.sepaintegration.SepaIntegrationImportDto;
import com.opencbs.loans.services.LoanService;
import com.opencbs.loans.xml.sepa.*;
import io.jsonwebtoken.lang.Assert;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Mapper
@RequiredArgsConstructor
public class SepaIntegrationMapper {

    private final LoanService loanService;
    private final PersonService personService;
    private final CompanyService companyService;
    private final GroupService groupService;
    private final CurrencyService currencyService;

    public GroupHeader generateXmlGroupHeader(List<Loan> loanList, LocalDate requiredDate){
        GroupHeader groupHeader = new GroupHeader();

        groupHeader.setMessageId(UUID.randomUUID().toString());
        groupHeader.setCreatedDateTime(DateHelper.getLocalDateTimeNow().format(DateHelper.DATE_TIME_FORMATTER));
        groupHeader.setNumberOfTransactions(loanList.size());
        groupHeader.setControlSum(getControlSum(loanList, requiredDate));
        groupHeader.setInitiatingParty(new InitiatingParty("MICROLUX"));

        return groupHeader;
    }

    public PaymentInfo generateXmlPaymentInformation(List<Loan> loanList, LocalDate requestedDate){
        PaymentInfo paymentInfo = new PaymentInfo();

        paymentInfo.setPaymentInfoId(UUID.randomUUID().toString());
        //TODO make clear about payment method
        paymentInfo.setPaymentMethod("DD");
        paymentInfo.setBatchBooking(loanList.size() > 1);
        paymentInfo.setNumberOfTransactions(loanList.size());
        paymentInfo.setControlSum(getControlSum(loanList, requestedDate));
        paymentInfo.setPaymentTypeInformation(generatePaymentTypeInformation());
        paymentInfo.setRequiredDate(requestedDate.format(DateHelper.DATE_FORMATTER));
        paymentInfo.setCreditor(generateCreditor());
        paymentInfo.setCreditorAccount(generateCreditorAccount());
        paymentInfo.setCreditorAgent(generateCreditorAgent());
        paymentInfo.setChargeBearer("SLEV");
        paymentInfo.setCreditorSchemeIdentification(generateCreditorSchemeIdentification());
        paymentInfo.setDirectDebitTransactionInformationList(generateDebitTransactionInformationList(loanList, requestedDate));

        return paymentInfo;
    }

    private PaymentTypeInformation generatePaymentTypeInformation(){
        PaymentTypeInformation paymentTypeInformation = new PaymentTypeInformation();

        //TODO make clear what isLast means and change to !isLast ? "RCUR" : "FNAL"
        paymentTypeInformation.setSequenceType("RCUR");
        paymentTypeInformation.setServiceLevel(new ServiceLevel("SEPA"));
        paymentTypeInformation.setLocalInstrument(new LocalInstrument("CORE"));

        return paymentTypeInformation;
    }

    private Creditor generateCreditor(){
        Creditor creditor = new Creditor();

        creditor.setName("MICROLUX");
        creditor.setPostalAddress(new PostalAddress("LU", Collections.singletonList("RUE GLESNER, 39 L-1631 LUXEMBOURG")));

        return creditor;
    }

    private CreditorAccount generateCreditorAccount(){
        CreditorAccount creditorAccount = new CreditorAccount();

        creditorAccount.setIdentification(new Identification("LU750030317052134000"));

        return creditorAccount;
    }

    private CreditorAgent generateCreditorAgent(){
        CreditorAgent creditorAgent = new CreditorAgent();
        FinancialInstitutionIdentification financialInstitutionIdentification = new FinancialInstitutionIdentification();

        //TODO set actual BIC number
        financialInstitutionIdentification.setBic("BGLLLULLXXX");
        creditorAgent.setFinancialInstitutionIdentification(financialInstitutionIdentification);

        return creditorAgent;
    }

    private CreditorSchemeIdentification generateCreditorSchemeIdentification(){
        CreditorSchemeIdentification creditorSchemeIdentification = new CreditorSchemeIdentification();

        SchemeName schemeName = new SchemeName();
        schemeName.setProprietary("SEPA");

        //TODO set actual id number
        Other other = new Other("LU59ZZZ000000000LU28524286", schemeName);
        CreditorSchemeId creditorSchemeId = new CreditorSchemeId(new PrivateId(other));

        creditorSchemeIdentification.setIdentification(creditorSchemeId);

        return creditorSchemeIdentification;
    }

    private List<DirectDebitTransactionInformation> generateDebitTransactionInformationList(List<Loan> loanList, LocalDate requiredDate){
        Assert.isTrue(!loanList.isEmpty(), "No data to parse for @DirectDebitTransactionInformation@");

        Assert.isTrue(loanList
                        .stream()
                        .noneMatch(x -> Objects.isNull(loanService.getActiveLoanInstallmentByLoan(x.getId(), requiredDate))),
                "One or more loans does not have installment on date: " + requiredDate.toString());

        List<DirectDebitTransactionInformation> directDebitTransactionInformationList = new ArrayList<>();
        for (Loan item : loanList) {
            Profile profile = item.getProfile();
            Optional<LoanInstallment> loanInstallmentOpt = loanService.getActiveLoanInstallmentByLoan(item.getId(), requiredDate);
            if (!loanInstallmentOpt.isPresent()) {
                continue;
            }
            LoanInstallment installment = loanInstallmentOpt.get();

            DirectDebitTransactionInformation directDebitTransactionInformation = new DirectDebitTransactionInformation();

            PaymentIdentification paymentIdentification = new PaymentIdentification();
            paymentIdentification.setInstructionIdentification(UUID.randomUUID().toString());
            paymentIdentification.setEndToEndIdentification(UUID.randomUUID().toString());
            directDebitTransactionInformation.setPaymentIdentification(paymentIdentification);

            InstructedAmount instructedAmount = new InstructedAmount();
            instructedAmount.setAmount(installment.getInterest().add(installment.getPrincipal()).setScale(2, BigDecimal.ROUND_HALF_UP));
            Optional<Currency> currencyOpt = currencyService.findOne(item.getCurrencyId());
            //get from global settings
            instructedAmount.setCurrency(currencyOpt.isPresent() ? currencyOpt.get().getName() : "EUR");
            directDebitTransactionInformation.setInstructedAmount(instructedAmount);

            MandateRelatedInformation mandateRelatedInformation = new MandateRelatedInformation();
            mandateRelatedInformation.setDateOfSignature(item.getDisbursementDate().format(DateHelper.DATE_FORMATTER));
            mandateRelatedInformation.setMandateIdentification(item.getCode());
            mandateRelatedInformation.setAmendmentIndicator(Boolean.FALSE);
            directDebitTransactionInformation.setDirectDebitTransaction(new DirectDebitTransaction(mandateRelatedInformation));

            FinancialInstitutionIdentification financialInstitutionIdentification = new FinancialInstitutionIdentification();
            Other other = new Other("NOTPROVIDED", null);
            financialInstitutionIdentification.setOther(other);
            directDebitTransactionInformation.setDebtorAgent(new DebtorAgent(financialInstitutionIdentification));

            Optional<String> address = getValueFromCustomFieldsByName("address", profile);
            Debtor debtor = new Debtor();
            debtor.setName(profile.getName());
            debtor.setPostalAddress(new PostalAddress(
                    "LU",
                    Collections.singletonList(address.orElse("NO_ADDRESS_FOUND_ON_PROFILE")))
            );
            directDebitTransactionInformation.setDebtor(debtor);

            Optional<String> iban = getValueFromCustomFieldsByName("new_iban", profile);
            if (iban.isPresent()) {
                mandateRelatedInformation.setAmendmentIndicator(Boolean.TRUE);
            }else {
                iban = getValueFromCustomFieldsByName("iban", profile);
            }

            directDebitTransactionInformation.setDebtorAccount(
                    new DebtorAccount(
                            new Identification(iban.orElse("NO_IBAN_FOUND_ON_THIS_PROFILE"))
                    )
            );

            RemittanceInformation remittanceInformation = new RemittanceInformation(
                    String.format("Repayment for contract %s, %s", item.getCode(), profile.getName())
            );

            directDebitTransactionInformation.setRemittanceInformation(remittanceInformation);

            directDebitTransactionInformationList.add(directDebitTransactionInformation);
        }

        return directDebitTransactionInformationList;
    }

    public List<SepaIntegrationImportDto> parseUploadedDataToImportDto(List<TransactionInformationAndStatus> sourceList){
        Assert.isTrue(!sourceList.isEmpty(), "No data in import file to parse");

        Assert.isTrue(
                sourceList
                        .stream()
                        .noneMatch(x -> Objects.isNull(x.getOriginalTransactionReference())),
                "One of @TransactionInformationAndStatus@ is broken!");

        Assert.isTrue(sourceList.stream().noneMatch(x ->
                Objects.isNull(loanService.getLoanByCode(x.getOriginalTransactionReference().getMandateRelatedInformation().getMandateIdentification()))
        ), "The loan not found by Mandate Identification");

        List<SepaIntegrationImportDto> result = new ArrayList<>();
        for (TransactionInformationAndStatus item : sourceList) {
            Loan loan = loanService.getLoanByCode(item.getOriginalTransactionReference().getMandateRelatedInformation().getMandateIdentification());
            result.add(SepaIntegrationImportDto
                    .builder()
                    .code(item.getOriginalTransactionReference().getMandateRelatedInformation().getMandateIdentification())
                    .date(item.getOriginalTransactionReference().getRequestedCollectionDate())
                    .amount(item.getOriginalTransactionReference().getAmount().getInstructedAmount().getAmount())
                    .status(item.getTransactionStatus())
                    .iban(item.getOriginalTransactionReference().getDebtorAccount().getIdentification().getIban())
                    .profileName(item.getOriginalTransactionReference().getDebtor().getName())
                    .description(item.getOriginalTransactionReference().getRemittanceInformation().getUnstructured())
                    .isValid(item.getTransactionStatus().equals("ACSC") ? Boolean.TRUE : Boolean.FALSE)
                    .loanId(loan.getId())
                    .build()
            );
        }

        return result;
    }

    public SepaDocumentCreateForm getSepaDocumentExportCreateForm(CustomerCreditTransferInitiation source){
        return SepaDocumentCreateForm
                .builder()
                .createdAt(DateHelper.getLocalDateTimeNow())
                .createdBy(UserHelper.getCurrentUser())
                .documentType(SepaDocumentType.EXPORT)
                .uid(source.getGroupHeader().getMessageId())
                .generatedForDate(LocalDate.parse(source.getPaymentInfo().getRequiredDate()))
                .numberOfTaxes(source.getGroupHeader().getNumberOfTransactions())
                .controlSum(source.getGroupHeader().getControlSum())
                .documentStatus(SepaDocumentStatus.EXPORTED)
                .build();
    }

    public SepaDocumentCreateForm getSepaDocumentImportCreateForm(CustomerPaymentStatusReport source){
        return SepaDocumentCreateForm
                .builder()
                .createdAt(DateHelper.getLocalDateTimeNow())
                .generatedForDate(DateHelper.convertStringToLocalDate(source.getGroupHeader().getCreatedDateTime().substring(0, 10)))
                .createdBy(UserHelper.getCurrentUser())
                .documentType(SepaDocumentType.IMPORT)
                .uid(source.getGroupHeader().getMessageId())
                .numberOfTaxes(source.getOriginalPaymentInformationAndStatus().getOriginalNumberOfTransactions())
                .controlSum(source.getOriginalPaymentInformationAndStatus().getOriginalControlSum())
                .documentStatus(SepaDocumentStatus.UPLOADED)
                .build();
    }

    public Optional<String> getValueFromCustomFieldsByName(String fieldName, Profile profile){
        List<? extends CustomFieldValue> customFieldValues;
        switch (profile.getType()){
            case "COMPANY": { customFieldValues = companyService.getCompany(profile.getId()).getCustomFieldValues(); break; }
            case "PERSON": { customFieldValues = personService.getPerson(profile.getId()).getCustomFieldValues(); break; }
            case "GROUP": { customFieldValues = groupService.getGroup(profile.getId()).getCustomFieldValues(); break; }
            default: { customFieldValues = new ArrayList<>(); break; }
        }

        String result = null;
        Optional<? extends CustomFieldValue> customFieldValue =
                customFieldValues
                        .stream()
                        .filter(x -> x.getCustomField().getName().equals(fieldName))
                        .findFirst();
        if (customFieldValue.isPresent())
            result = customFieldValue.get().getValue();

        return Optional.ofNullable(result);
    }

    private BigDecimal getControlSum(List<Loan> loanList, LocalDate requiredDate){
        BigDecimal result = new BigDecimal("0");
        for (Loan item : loanList){
            Optional<LoanInstallment> loanInstallmentOpt = loanService.getActiveLoanInstallmentByLoan(item.getId(), requiredDate);
            if (!loanInstallmentOpt.isPresent()) {
                continue;
            }
            LoanInstallment installment = loanInstallmentOpt.get();

            result = result.add(installment.getInterest());
            result = result.add(installment.getPrincipal());
        }

        return result.setScale(2, BigDecimal.ROUND_HALF_UP);
    }
}
