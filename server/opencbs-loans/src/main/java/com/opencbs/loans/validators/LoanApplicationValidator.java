package com.opencbs.loans.validators;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.EntryFee;
import com.opencbs.core.domain.Penalty;
import com.opencbs.core.domain.enums.ScheduleBasedType;
import com.opencbs.core.dto.group.GroupMemberAmountsDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.NumericHelper;
import com.opencbs.core.services.EntryFeeService;
import com.opencbs.core.services.PayeeService;
import com.opencbs.core.services.PenaltyService;
import com.opencbs.core.services.ProfileService;
import com.opencbs.loans.credit.lines.domain.CreditLine;
import com.opencbs.loans.credit.lines.services.CreditLineService;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.domain.LoanInfo;
import com.opencbs.loans.domain.enums.LoanApplicationStatus;
import com.opencbs.loans.domain.products.LoanProduct;
import com.opencbs.loans.domain.products.LoanProductAccount;
import com.opencbs.loans.dto.loanapplications.LoanApplicationBaseDto;
import com.opencbs.loans.dto.loanapplications.LoanApplicationCreateDto;
import com.opencbs.loans.dto.loanapplications.LoanApplicationEntryFeeDto;
import com.opencbs.loans.dto.loanapplications.LoanApplicationPayeesDto;
import com.opencbs.loans.services.LoanApplicationService;
import com.opencbs.loans.services.LoanProductService;
import com.opencbs.loans.services.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Validator
@RequiredArgsConstructor
public class LoanApplicationValidator {

    private final ProfileService profileService;
    private final LoanProductService loanProductService;
    private final PayeeService payeeService;
    private final EntryFeeService entryFeeService;
    private final PenaltyService penaltyService;
    private final CreditLineService creditLineService;
    private final LoanApplicationService loanApplicationService;
    private final LoanService loanService;

    public void validateOnCreate(LoanApplicationCreateDto dto) {
        this.validate(dto);

        if (!CollectionUtils.isEmpty(dto.getPenaltyIds())) {
            for (Penalty penalty : this.penaltyService.findAllByIds(dto.getPenaltyIds())) {
                Assert.isTrue(dto.getPenaltyIds().stream().anyMatch(id->penalty.getId().compareTo(id)==0), String.format("Not found penalty with ID=%s", penalty.getId()));
            }
        }
    }

    public void validateOnUpdate(LoanApplicationBaseDto dto) {
        this.validate(dto);
    }

    private void validate(LoanApplicationBaseDto dto) {
        Set<Long> currencies = new HashSet<>();
        dto.getAmounts().removeIf(x -> x.getAmount() == null || x.getAmount().equals(BigDecimal.ZERO));

        Assert.notNull(dto.getLoanProductId(), "Loan product is required.");
        LoanProduct loanProduct = this.loanProductService.getOne(dto.getLoanProductId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Loan product not found (ID=%d).", dto.getLoanProductId())));

        if (dto.getCreditLineId() != null) {
            CreditLine creditLine = this.creditLineService.getCreditLineById(dto.getCreditLineId());

            Assert.isTrue(DateHelper.greaterOrEqual(dto.getDisbursementDate(), creditLine.getStartDate()), "Disbursement date should be equal or after credit line start date");
            Assert.isTrue(creditLine.getLastDisbursementDate().isAfter(dto.getDisbursementDate()), "Disbursement date should be before credit line last disbursement date");

            List<LoanApplication> loanApplications = this.loanApplicationService.getAllByCreditLine(creditLine)
                    .stream()
                    .filter(x -> x.getStatus().equals(LoanApplicationStatus.DISBURSED))
                    .collect(Collectors.toList());
            List<Loan> loans = new ArrayList<>();
            BigDecimal olb = BigDecimal.ZERO;

            if (!loanApplications.isEmpty()) {
                for (LoanApplication loanApplication : loanApplications) {
                    loans.add(this.loanService.getByLoanApplication(loanApplication));
                }

                for (Loan loan : loans) {
                    LoanInfo loanInfo = this.loanService.getLoanInfo(loan.getId(), LocalDate.now());
                    olb = olb.add(loanInfo.getOlb());
                }

                for (GroupMemberAmountsDto amountMember : dto.getAmounts()) {
                    Assert.isTrue(creditLine.getCommittedAmount().subtract(olb).compareTo(amountMember.getAmount()) >= 0
                            , "Net Amount cannot be greater than credit line available amount");
                }
            }
            else {
                for (GroupMemberAmountsDto amountMember : dto.getAmounts()) {
                    Assert.isTrue(creditLine.getCommittedAmount().compareTo(amountMember.getAmount()) >= 0
                            , "Net Amount cannot be greater than credit line available amount");
                }
            }
        }
        else {
            for(GroupMemberAmountsDto amountMember : dto.getAmounts()) {
                Assert.isTrue(
                        NumericHelper.between(amountMember.getAmount(), loanProduct.getAmountMin(), loanProduct.getAmountMax()),
                        String.format("Amount must be within the range %f and %f.",
                                loanProduct.getAmountMin(), loanProduct.getAmountMax()));
            }
        }

        if (loanProduct.getCurrency() == null) {
            for (LoanProductAccount loanProductAccount : loanProduct.getAccounts()) {
                Account account = loanProductAccount.getAccount();
                Currency accountCurrency = account.getCurrency();
                if (accountCurrency != null) {
                    currencies.add(accountCurrency.getId());
                }
            }

            for (EntryFee entryFee : loanProduct.getFees()) {
                Account account = entryFee.getAccount();
                Currency entryFeeCurrency = account.getCurrency();
                if (entryFeeCurrency != null) {
                    currencies.add(entryFeeCurrency.getId());
                }
            }

            for (Penalty penalty : loanProduct.getPenalties()) {
                List<Account> penaltyAccounts = new ArrayList<>();
                penaltyAccounts.add(penalty.getAccrualAccount());
                penaltyAccounts.add(penalty.getIncomeAccount());
                penaltyAccounts.add(penalty.getWriteOffAccount());
                for (Account account : penaltyAccounts) {
                    Currency penaltyCurrency = account.getCurrency();
                    if (penaltyCurrency != null) {
                        currencies.add(penaltyCurrency.getId());
                    }
                }
            }

            for (Long currency : currencies) {
                Assert.isTrue(currency.equals(dto.getCurrencyId()), "Loan application currency and all accounts currencies have to be the same");
            }
        }

        Assert.notNull(dto.getScheduleType(), "Schedule type is required.");
        Assert.notNull(dto.getScheduleBasedType(), "Schedule base type is required.");
        Assert.notNull(dto.getDisbursementDate(), "Disbursement date is required.");
        Assert.isTrue(!DateHelper.isDayOff(dto.getDisbursementDate()), "Disbursement date should be a working date");
        Assert.notNull(dto.getPreferredRepaymentDate(), "Preferred repayment date is required.");
        Assert.isTrue(dto.getDisbursementDate().compareTo(dto.getPreferredRepaymentDate()) < 0, "Disbursement date should precede Preferred repayment date.");
        Assert.notNull(dto.getProfileId(), "Profile ID is required.");
        if (dto.getScheduleBasedType().equals(ScheduleBasedType.BY_MATURITY)) {
            Assert.isTrue(!DateHelper.isDayOff(dto.getMaturityDate()), "Maturity date should be a working date");
            Assert.isTrue(dto.getPreferredRepaymentDate().compareTo(dto.getMaturityDate()) <= 0, "Preferred repayment date cannot be greater than Maturity date.");
            Assert.isTrue(dto.getMaturityDate().compareTo(loanProduct.getMaturityDateMax()) <= 0, "Maturity date cannot be greater than Max maturity date.");
        }

        this.profileService.findOne(dto.getProfileId()).orElseThrow(() -> new ResourceNotFoundException(
                String.format("Profile not found (ID=%d).", dto.getProfileId())));

        Assert.notNull(dto.getInterestRate(), "Interest rate is required.");
        if (dto.getCreditLineId() != null) {
            CreditLine creditLine = this.creditLineService.getCreditLineById(dto.getCreditLineId());
            Assert.isTrue(NumericHelper.between(dto.getInterestRate(), creditLine.getInterestRateMin(), creditLine.getInterestRateMax()),
                    String.format("Interest rate must be within the range %f and %f.", creditLine.getInterestRateMin(), creditLine.getInterestRateMax()));
        }
        else {
            Assert.isTrue(NumericHelper.between(dto.getInterestRate(), loanProduct.getInterestRateMin(), loanProduct.getInterestRateMax()),
                    String.format("Interest rate must be within the range %f and %f.", loanProduct.getInterestRateMin(), loanProduct.getInterestRateMax()));
        }

        Assert.isTrue(
                loanProduct.getGracePeriodMin() <= dto.getGracePeriod()
                        && dto.getGracePeriod() <= loanProduct.getGracePeriodMax(),
                String.format("Grace period must be within the range %d and %d.",
                        loanProduct.getGracePeriodMin(), loanProduct.getGracePeriodMax()));

        if (dto.getScheduleBasedType().equals(ScheduleBasedType.BY_INSTALLMENT)) {
            Assert.notNull(dto.getMaturity(), "Maturity is required.");
            Assert.isTrue(
                    loanProduct.getMaturityMin() <= dto.getMaturity()
                            && dto.getMaturity() <= loanProduct.getMaturityMax(),
                    String.format("Maturity must be within the range %d and %d.",
                            loanProduct.getMaturityMin(), loanProduct.getMaturityMax()));

            Assert.isTrue(dto.getGracePeriod() < dto.getMaturity(),
                    String.format("Grace period must be less than number of installments"));
        }

        if (dto.getScheduleBasedType().equals(ScheduleBasedType.BY_MATURITY)) {
            long daysBetween = ChronoUnit.DAYS.between(dto.getDisbursementDate(), dto.getMaturityDate());
            int maturity = (int) (daysBetween / dto.getScheduleType().getDays());
            if (maturity==0 && daysBetween!=0) {
                maturity = 1;
            }
            Assert.isTrue(dto.getGracePeriod() < maturity, String.format("Grace period must be less than number of installments"));
        }

        Assert.isTrue(!(loanProduct.getCurrency() == null && dto.getCurrencyId() == null), "Currency is required.");
        Assert.isTrue(!(loanProduct.getScheduleType() == null && dto.getScheduleType() == null), "Schedule type is required.");

        if (dto.getPayees() != null) {
            for (LoanApplicationPayeesDto loanApplicationPayeesDto : dto.getPayees()) {
                Assert.notNull(loanApplicationPayeesDto.getPayeeId(), "Payee id required.");
                this.payeeService.findOne(loanApplicationPayeesDto.getPayeeId()).orElseThrow(() -> new ResourceNotFoundException(
                        String.format("Payee not found (ID=%d).", loanApplicationPayeesDto.getPayeeId())));
                Assert.notNull(loanApplicationPayeesDto.getAmount(), "Amount is required.");
                Assert.notNull(!StringUtils.isEmpty(loanApplicationPayeesDto.getPlannedDisbursementDate()), "Disbursement date is required");
                Assert.isTrue(DateHelper.isValidDate(String.valueOf(loanApplicationPayeesDto.getPlannedDisbursementDate())), "Disbursement date is an invalid date format.");
            }
        }

        if (dto.getEntryFees() != null) {
            for (LoanApplicationEntryFeeDto loanApplicationEntryFeeDto : dto.getEntryFees()) {
                Assert.notNull(loanApplicationEntryFeeDto.getEntryFeeId(), "Entry fee id is required.");
                EntryFee entryFee = this.entryFeeService
                        .findOne(loanApplicationEntryFeeDto.getEntryFeeId())
                        .orElseThrow(
                                () -> new ResourceNotFoundException(String.format("Entry fee not found (ID=%d).", loanApplicationEntryFeeDto.getEntryFeeId())));

                if (entryFee.isPercentage()) {
                    if (entryFee.getMinLimit() != null) {
                        Assert.isTrue(loanApplicationEntryFeeDto.getAmount().compareTo(entryFee.getMinLimit()) >= 0, "Amount of entry fee should be more or equal to minimum limit");
                    }

                    if (entryFee.getMaxLimit() != null) {
                        Assert.isTrue(loanApplicationEntryFeeDto.getAmount().compareTo(entryFee.getMaxLimit()) <= 0, "Amount of entry fee should be less than maximum limit");
                    }
                } else {
                    Assert.isTrue(loanApplicationEntryFeeDto.getAmount().compareTo(entryFee.getMinValue()) >= 0, String.format("Amount should be more or equal to minimum value %s", entryFee.getMinValue()));
                    Assert.isTrue(loanApplicationEntryFeeDto.getAmount().compareTo(entryFee.getMaxValue()) <= 0, String.format("Amount should be less than maximum value %s", entryFee.getMaxValue()));
                }

                this.entryFeeService.findOne(loanApplicationEntryFeeDto.getEntryFeeId()).orElseThrow(() -> new ResourceNotFoundException(
                        String.format("Entry fee not found (ID=%d).", loanApplicationEntryFeeDto.getEntryFeeId())));
            }
        }
    }
}
