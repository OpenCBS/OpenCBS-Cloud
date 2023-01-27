package com.opencbs.bonds.validators;

import com.opencbs.bonds.domain.Bond;
import com.opencbs.bonds.domain.BondEvent;
import com.opencbs.bonds.domain.BondInstallment;
import com.opencbs.bonds.domain.BondProduct;
import com.opencbs.bonds.dto.BondDto;
import com.opencbs.bonds.dto.BondExpireDateDto;
import com.opencbs.bonds.services.BondEventService;
import com.opencbs.bonds.services.BondService;
import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.annotations.Validator;
import com.opencbs.core.dayclosure.contract.DayClosureContractService;
import com.opencbs.core.domain.RepaymentSplit;
import com.opencbs.core.domain.RepaymentTypes;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.domain.enums.ProcessType;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.CurrencyService;
import com.opencbs.core.services.ProfileService;
import com.opencbs.core.validators.BaseValidator;
import io.jsonwebtoken.lang.Assert;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Validator
public class BondValidator extends BaseValidator {

    private final BondService bondService;
    private final ProfileService profileService;
    private final CurrencyService currencyService;
    private final AccountService accountService;
    private final BondEventService bondEventService;
    private final DayClosureContractService dayClosureContractService;

    @Autowired
    public BondValidator(BondService bondService,
                         ProfileService profileService,
                         CurrencyService currencyService,
                         AccountService accountService,
                         BondEventService bondEventService,
                         DayClosureContractService dayClosureContractService) {
        this.bondService = bondService;
        this.profileService = profileService;
        this.currencyService = currencyService;
        this.accountService = accountService;
        this.bondEventService = bondEventService;
        this.dayClosureContractService = dayClosureContractService;
    }

    public void validate(BondDto dto) {
        Assert.notNull(dto.getBondProductId(), "Bond product is required.");
        BondProduct product = this.getBondProduct(dto.getBondProductId());

        Assert.notNull(dto.getNumber(), "Number of bonds is required.");
        Assert.isTrue(this.between(dto.getNumber(), product.getNumberMin(), product.getNumberMax()),
                String.format("Number of bonds must be within the range %f and %f.",
                        product.getNumberMin(), product.getNumberMax()));

        Assert.notNull(dto.getEquivalentCurrencyId(), "Currency is required");
        Assert.isTrue(this.currencyService.findOne(dto.getEquivalentCurrencyId()).isPresent(),
                "Invalid currency");

        Assert.notNull(dto.getBankAccountId(), "Bank Account is required");
        Optional<Account> bankAccount = this.accountService.findOne(dto.getBankAccountId());
        Assert.isTrue(bankAccount.isPresent(), String.format("Bank account is not found(ID=%d).", dto.getBankAccountId()));

        Assert.notNull(dto.getInterestRate(), "Interest Rate is required.");
        Assert.isTrue(this.between(dto.getInterestRate(), product.getInterestRateMin(), product.getInterestRateMax()),
                String.format("Interest Rate must be within the range %f and %f.",
                        product.getInterestRateMin(), product.getInterestRateMax()));

        Assert.notNull(dto.getFrequency(), "Coupon Frequency is required");

        Assert.notNull(dto.getInterestScheme(), "Interest Scheme is required");

        Assert.notNull(dto.getMaturity(), "Maturity is required.");
        Assert.isTrue(dto.getMaturity() >= product.getMaturityMin() && dto.getMaturity() <= product.getMaturityMax(),
                String.format("Maturity must be within the range %d and %d.",
                        product.getMaturityMin(), product.getMaturityMax()));

        Assert.notNull(dto.getSellDate(), "Start Date is required");
        Assert.notNull(dto.getCouponDate(), "Coupon Date is required");
        Assert.isTrue(DateHelper.greater(dto.getCouponDate(), dto.getSellDate()), "Coupon Date must be greater than Value Date");
        Assert.notNull(dto.getExpireDate(), "Expire Date is required");
    }

    public void validateOnCreate(BondDto dto) {
        Assert.notNull(dto.getProfileId(), "Profile is required.");
        Optional<Profile> profile = this.profileService.findOne(dto.getProfileId());
        Assert.isTrue(profile.isPresent(), String.format("Profile is not found(ID=%d).", dto.getProfileId()));

        this.validate(dto);
    }

    public void validateExpireDate(BondExpireDateDto dto) {
        Assert.notNull(dto.getBondProductId(), "Bond product is required.");
        BondProduct product = this.getBondProduct(dto.getBondProductId());

        Assert.notNull(dto.getFrequency(), "Coupon Frequency is required");

        Assert.notNull(dto.getMaturity(), "Maturity is required.");
        Assert.isTrue(dto.getMaturity() >= product.getMaturityMin() && dto.getMaturity() <= product.getMaturityMax(),
                String.format("Maturity must be within the range %d and %d.",
                        product.getMaturityMin(), product.getMaturityMax()));

        Assert.notNull(dto.getCouponDate(), "Coupon Date is required");
    }

    private BondProduct getBondProduct(Long id) {
        BondProduct product = this.bondService.findOneProduct(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format("Bond Product is not found(ID=%d).", id)));
        return product;
    }

    private boolean between(BigDecimal amount, BigDecimal min, BigDecimal max) {
        return min.doubleValue() <= amount.doubleValue() && amount.doubleValue() <= max.doubleValue();
    }

    public void quantityValidate(Integer quantity, Long currencyId) {
        Assert.notNull(quantity, "Quantity is required.");
        Assert.notNull(currencyId, "CurrencyId is required.");
    }

    public void validateClosedBond(Long bondId) {
        Optional<BondEvent> closedEvent = this.bondEventService.findAllByBondId(bondId)
                .stream()
                .filter(x -> x.getEventType().equals(EventType.CLOSED))
                .findFirst();

        closedEvent.ifPresent(bondEvent -> Assert.isTrue(bondEvent.getEffectiveAt()
                .compareTo(LocalDateTime.now()) <= 0, "Bond is closed."));
    }

    public void repayValidateBond(Bond bond, RepaymentSplit repaymentSplit){
        List<BondInstallment> installments = this
                .bondService.getInstallmentsByBond(bond);
        List<BondInstallment> unpaidInstallments = this.getUnpaidInstallments(installments);
        BondInstallment firstUnpaidInstallment = unpaidInstallments.get(0);

        if(repaymentSplit.getRepaymentType().equals(RepaymentTypes.NORMAL_REPAYMENT)){
            Assert.isTrue((firstUnpaidInstallment.getAccruedInterest().equals(firstUnpaidInstallment.getInterest())),
                    String.format("You have to actualize this bond on the date %tF %n",
                            firstUnpaidInstallment.getMaturityDate()));
        }
        if(repaymentSplit.getRepaymentType().equals(RepaymentTypes.EARLY_TOTAL_REPAYMENT)){
            LocalDate lastRunDay = dayClosureContractService.getLastRunDay(bond.getId(), ProcessType.BOND_INTEREST_ACCRUAL);
            Assert.isTrue(lastRunDay.equals(DateHelper.getLocalDateNow().minusDays(1)) || lastRunDay.equals(DateHelper.getLocalDateNow()) ,
                    String.format("You have to actualize this bond on the date %tF %n.",
                    DateHelper.getLocalDateNow().minusDays(1)));
        }
    }

    private List<BondInstallment> getUnpaidInstallments(List<BondInstallment> installments) {
        List<BondInstallment> unpaidInstallments = installments
                .stream()
                .filter(x -> !x.isPaid())
                .collect(Collectors.toList());
        return unpaidInstallments;
    }
}
