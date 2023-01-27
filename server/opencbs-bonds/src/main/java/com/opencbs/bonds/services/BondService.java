package com.opencbs.bonds.services;

import com.opencbs.bonds.domain.Bond;
import com.opencbs.bonds.domain.BondEvent;
import com.opencbs.bonds.domain.BondInstallment;
import com.opencbs.bonds.domain.BondProduct;
import com.opencbs.bonds.domain.SimplifiedBond;
import com.opencbs.bonds.domain.enums.BondStatus;
import com.opencbs.bonds.dto.BondAmountDto;
import com.opencbs.bonds.repositories.BondRepository;
import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.Holiday;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.EventType;
import com.opencbs.core.domain.enums.InterestScheme;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.domain.schedule.Installment;
import com.opencbs.core.domain.schedule.ScheduleParams;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.AbstractExchangeRateService;
import com.opencbs.core.services.CurrencyService;
import com.opencbs.core.services.HolidayService;
import com.opencbs.core.services.schedulegenerators.ScheduleGeneratorTypes;
import com.opencbs.core.services.schedulegenerators.ScheduleService;
import lombok.NonNull;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.script.ScriptException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.groupingBy;

@Service
public class BondService {

    private final BondRepository bondRepository;
    private final BondGlobalSettingService bondGlobalSettingService;
    private final ScheduleService scheduleService;
    private final ModelMapper modelMapper;
    private final BondProductService bondProductService;
    private final AbstractExchangeRateService abstractExchangeRateService;
    private final CurrencyService currencyService;
    private final HolidayService holidayService;
    private final BondInstallmentService bondInstallmentService;
    private final BondEventService bondEventService;

    @Autowired
    public BondService(BondRepository bondRepository,
                       BondGlobalSettingService bondGlobalSettingService,
                       ScheduleService scheduleService,
                       ModelMapper modelMapper,
                       BondProductService bondProductService,
                       AbstractExchangeRateService abstractExchangeRateService,
                       CurrencyService currencyService,
                       HolidayService holidayService,
                       BondInstallmentService bondInstallmentService,
                       BondEventService bondEventService) {
        this.bondRepository = bondRepository;
        this.bondGlobalSettingService = bondGlobalSettingService;
        this.scheduleService = scheduleService;
        this.modelMapper = modelMapper;
        this.bondProductService = bondProductService;
        this.abstractExchangeRateService = abstractExchangeRateService;
        this.currencyService = currencyService;
        this.holidayService = holidayService;
        this.bondInstallmentService = bondInstallmentService;
        this.bondEventService = bondEventService;
    }

    public Optional<BondProduct> findOneProduct(Long id) {
        return Optional.ofNullable(this.bondProductService.findOne(id));
    }

    public Bond findById(Long id) throws ResourceNotFoundException {
        return this.bondRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Bond is not found (ID=%d).", id)));
    }

    public Bond save(Bond bond) {
        return this.bondRepository.save(bond);
    }

    public Bond create(Bond bond, User user) throws ScriptException, ResourceNotFoundException {
        List<BondInstallment> bondInstallments = this.getInstallments(bond);
        bond.setInstallments(bondInstallments);
        bond.setIsin("");
        bond.setInstallments(this.getInstallments(bond));
        bond.setCreatedBy(user);
        bond.setCreatedAt(DateHelper.getLocalDateTimeNow());
        bond.setStatus(BondStatus.IN_PROGRESS);
        bond = this.bondRepository.save(bond);
        bond.setIsin(this.bondGlobalSettingService.generateBondCode(bond));
        return this.bondRepository.save(bond);
    }

    public List<BondInstallment> preview(Bond bond) {
        return this.getInstallments(bond);
    }

    public Bond update(Bond bond) throws ScriptException, ResourceNotFoundException {
        bond.setInstallments(this.getInstallments(bond));
        String code = this.bondGlobalSettingService.generateBondCode(bond);
        bond.setIsin(code);
        return this.bondRepository.save(bond);
    }

    public Page<SimplifiedBond> getAllSimplifiedBonds(String searchQuery, Pageable pageable) {
        return this.bondRepository.findAllSimplifiedBonds(searchQuery, pageable);
    }

    public List<BondInstallment> getInstallments(Bond bond) {
        List<Installment> installments = this.scheduleService.getSchedule(this.getScheduleParams(bond));
        LocalDateTime now = DateHelper.getLocalDateTimeNow();
        return installments
                .stream()
                .map(x -> {
                    BondInstallment bondInstallments =
                            this.modelMapper.map(x, BondInstallment.class);
                    bondInstallments.setBond(bond);
                    bondInstallments.setEffectiveAt(now);
                    bondInstallments.setRescheduled(false);
                    return bondInstallments;
                })
                .collect(Collectors.toList());
    }

    public List<BondInstallment> getInstallmentsByBond(Bond bond) {
        List<BondInstallment> allByBonds = this.bondInstallmentService.findAllByBondId(bond.getId());
        Map<Integer, List<BondInstallment>> collect =
                allByBonds.stream()
                        .sorted(Comparator.comparing(BondInstallment::getNumber))
                        .collect(groupingBy(BondInstallment::getNumber));
        List<BondInstallment> installments = new ArrayList<>();
        for (Map.Entry<Integer, List<BondInstallment>> integerListEntry : collect.entrySet()) {
            installments.add(integerListEntry
                    .getValue()
                    .stream()
                    .filter(bondInstallment -> bondInstallment.getEventGroupKey() != null)
                    .max(Comparator.comparing(BondInstallment::getEventGroupKey))
                    .get());
        }

        this.setAccrualInterest(allByBonds, bond.getId(), DateHelper.getLocalDateTimeNow());
        return installments;
    }

    private ScheduleParams getScheduleParams(Bond bond) {
        ScheduleParams params = this.modelMapper.map(bond, ScheduleParams.class);
        params.setAmount(bond.getEquivalentAmount());
        params.setDisbursementDate(bond.getSellDate());
        params.setPreferredRepaymentDate(bond.getCouponDate());
        params.setGracePeriod(bond.getMaturity() - 1);
        this.setInterestSchemeAndFrequency(bond, params);
        return params;
    }

    //Todo: It's magic function, need rewrite without stringbuilder
    private void setInterestSchemeAndFrequency(Bond bond, ScheduleParams params) {
        StringBuilder stringBuilder = new StringBuilder("ANNUITY");
        stringBuilder.append(String.format("_%s", bond.getFrequency()));
        if (InterestScheme.FACT_FACT.equals(bond.getInterestScheme())) {
            stringBuilder.append("_FACT");
        }
        params.setScheduleType(ScheduleGeneratorTypes.valueOf(stringBuilder.toString()));
    }

    public BondAmountDto getBondAmount(Integer quantity, Long currencyId, LocalDateTime date) {
        BondProduct cost = this.bondProductService.getDefaultBondProduct().get();
        BigDecimal amount = cost.getAmount().multiply(BigDecimal.valueOf(quantity));
        Currency fromCurrency = this.bondProductService.getDefaultBondProduct().get().getCurrency();
        Currency toCurrency = this.currencyService.findOne(currencyId).get();
        BondAmountDto bond = new BondAmountDto();
        bond.setAmount(amount);
        amount = this.abstractExchangeRateService.getConvertedRate(fromCurrency, toCurrency, amount, date, true);
        bond.setEquivalentAmount(amount);
        return bond;
    }

    public Page<Bond> getByProfile(Pageable pageable, Profile profile) {
        List<Bond> allProfilesBonds = this.bondRepository.findAllByProfile(pageable, profile);
        return new PageImpl<>(allProfilesBonds, pageable, allProfilesBonds.size());
    }

    public LocalDate getExpireDate(Bond bond) {
        LocalDate expireDate = null;
        int period;
        switch (bond.getFrequency()) {
            case MONTHLY:
                period = 1;
                break;
            case QUARTERLY:
                period = 3;
                break;
            case SEMIANNUALLY:
                period = 6;
                break;
            default:
                throw new RuntimeException(String.format("The %s frequency type is not found", bond.getFrequency()));
        }

        for (int i = 0; i < bond.getMaturity(); i++) {
            LocalDate maturityDate =
                    i == 0 ? bond.getCouponDate() : this.getDate(bond.getCouponDate(), i * period);
            expireDate = maturityDate;
        }

        return expireDate;
    }

    private LocalDate getDate(LocalDate date, long number) {
        List<Holiday> holidays = this.holidayService.findAll();
        return DateHelper.shiftDate(date.plusMonths(number), holidays);
    }

    public List<Long> getActiveBondIds(Branch branch) {
        return this.bondRepository.findIdsWhenBondHasStatus(BondStatus.SOLD, branch);
    }

    private void setAccrualInterest(List<BondInstallment> bondInstallments, Long bondId, LocalDateTime effectiveAt) {
        Function<List<BondEvent>, Map<Integer, BigDecimal>> getAmountFromEvents = listOfEvents -> {
            Map<Integer, List<BondEvent>> groupedBondEvents = listOfEvents.stream().collect(Collectors.groupingBy(BondEvent::getInstallmentNumber));
            Map<Integer, BigDecimal> groupedAmount = new HashMap<>();
            for (Map.Entry<Integer, List<BondEvent>> number : groupedBondEvents.entrySet()) {
                groupedAmount.put(number.getKey(), number.getValue().stream().map(BondEvent::getAmount).reduce(BigDecimal::add).orElse(BigDecimal.ZERO));
            }
            return groupedAmount;
        };

        List<BondEvent> accrualInterestEvents = this.bondEventService
                .findAllByBondIdAndDeletedAndEventTypeAndEffectiveAt(bondId, false, EventType.ACCRUAL_OF_INTEREST, effectiveAt);
        if (accrualInterestEvents.isEmpty()) {
            bondInstallments.forEach(installment -> installment.setAccruedInterest(BigDecimal.ZERO));
        } else {
            Map<Integer, BigDecimal> accrualInterestAmounts = getAmountFromEvents.apply(accrualInterestEvents);
            bondInstallments.forEach(installment -> {
                if (accrualInterestAmounts.containsKey(installment.getNumber())) {
                    installment.setAccruedInterest(accrualInterestAmounts.get(installment.getNumber()));
                } else {
                    installment.setAccruedInterest(BigDecimal.ZERO);
                }
            });
        }
    }

    public BigDecimal getInterestToRefund(@NonNull Bond bond) {
        if (bond.getValueDate() == null) {
            return BigDecimal.ZERO;
        }

        List<BondEvent> accrualInterestEvents = this.bondEventService
                .findAllByBondIdAndDeletedAndEventTypeAndEffectiveAt(bond.getId(), false, EventType.ACCRUAL_OF_INTEREST,
                        LocalDateTime.of(bond.getValueDate(), LocalTime.MAX));

        BigDecimal interestToRefund = BigDecimal.ZERO;
        for (BondEvent bondEvent : accrualInterestEvents) {
            interestToRefund = interestToRefund.add(bondEvent.getAmount());
        }

        return interestToRefund;
    }
}
