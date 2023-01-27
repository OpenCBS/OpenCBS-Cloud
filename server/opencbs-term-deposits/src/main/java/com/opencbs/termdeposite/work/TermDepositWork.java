package com.opencbs.termdeposite.work;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.services.AccountingEntryService;
import com.opencbs.core.annotations.Work;
import com.opencbs.core.dayclosure.contract.DayClosureContractService;
import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.Currency;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.ProcessType;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.services.ProfileService;
import com.opencbs.core.services.UserService;
import com.opencbs.termdeposite.domain.TermDeposit;
import com.opencbs.termdeposite.domain.TermDepositAccountingEntry;
import com.opencbs.termdeposite.domain.enums.TermDepositAccountType;
import com.opencbs.termdeposite.domain.enums.TermDepositAction;
import com.opencbs.termdeposite.domain.enums.TermDepositStatus;
import com.opencbs.termdeposite.dto.TermDepositDetailsDto;
import com.opencbs.termdeposite.dto.TermDepositDto;
import com.opencbs.termdeposite.dto.TermDepositSimplified;
import com.opencbs.termdeposite.mapper.TermDepositMapper;
import com.opencbs.termdeposite.processing.TermDepositActualizeService;
import com.opencbs.termdeposite.processing.TermDepositContainer;
import com.opencbs.termdeposite.services.*;
import com.opencbs.termdeposite.validators.TermDepositValidator;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Optional;
import java.util.stream.Collectors;

@Work
public class TermDepositWork {

    private final TermDepositService termDepositService;
    private final TermDepositAccountingService termDepositAccountingService;
    private final TermDepositMapper termDepositMapper;
    private final TermDepositValidator termDepositValidator;
    private final ProfileService profileService;
    private final AccountingEntryService accountingEntryService;
    private final UserService userService;
    private final DayClosureContractService dayClosureContractService;
    private final TermDepositAccountingEntryService termDepositAccountingEntryService;
    private final TermDepositActualizeService termDepositActualizeService;
    private final TermDepositContainer termDepositContainer;
    private final TermDepositCodeGenerator termDepositCodeGenerator;

    @Autowired
    public TermDepositWork(@NonNull TermDepositService termDepositService,
                           @NonNull TermDepositAccountingService termDepositAccountingService,
                           @NonNull TermDepositMapper termDepositMapper,
                           @NonNull TermDepositValidator termDepositValidator,
                           @NonNull ProfileService profileService,
                           @NonNull AccountingEntryService accountingEntryService,
                           @NonNull UserService userService,
                           @NonNull DayClosureContractService dayClosureContractService,
                           @NonNull TermDepositAccountingEntryService termDepositAccountingEntryService,
                           @NonNull TermDepositActualizeService termDepositActualizeService,
                           @NonNull TermDepositContainer termDepositContainer,
                           @NonNull TermDepositCodeGenerator termDepositCodeGenerator) {
        this.termDepositService = termDepositService;
        this.termDepositAccountingService = termDepositAccountingService;
        this.termDepositMapper = termDepositMapper;
        this.termDepositValidator = termDepositValidator;
        this.profileService = profileService;
        this.accountingEntryService = accountingEntryService;
        this.userService = userService;
        this.dayClosureContractService = dayClosureContractService;
        this.termDepositAccountingEntryService = termDepositAccountingEntryService;
        this.termDepositActualizeService = termDepositActualizeService;
        this.termDepositContainer = termDepositContainer;
        this.termDepositCodeGenerator = termDepositCodeGenerator;
    }

    public TermDepositDetailsDto create(@NonNull TermDepositDto termDepositDto, User user) throws Exception {
        this.termDepositValidator.validate(termDepositDto);
        TermDeposit termDeposit = this.termDepositMapper.mapToEntity(termDepositDto);
        termDeposit.setCode("");
        termDeposit.setStatus(TermDepositStatus.IN_PROGRESS);
        termDeposit.setId(null);
        termDeposit.setBranch(user.getBranch());
        this.termDepositService.save(termDeposit);
        termDeposit.setCode(termDepositCodeGenerator.generateCode(termDeposit));
        return this.termDepositMapper.mapToDetailDto(this.termDepositService.save(termDeposit));
    }

    public TermDepositDetailsDto update(@NonNull Long id, TermDepositDto termDepositDto) {
        this.termDepositValidator.validateOnUpdate(termDepositDto);

        TermDeposit existTermDeposit = getExistingTermDepositById(id);
        termDepositDto.setId(id);
        this.termDepositValidator.validateOnUpdate(termDepositDto);
        TermDeposit termDeposit = this.termDepositMapper.mapToEntity(termDepositDto);

        existTermDeposit.setTermDepositProduct(termDeposit.getTermDepositProduct());
        existTermDeposit.setOpenDate(termDeposit.getOpenDate());
        existTermDeposit.setTermAgreement(termDeposit.getTermAgreement());
        existTermDeposit.setInterestRate(termDeposit.getInterestRate());
        existTermDeposit.setServiceOfficer(termDeposit.getServiceOfficer());

        return this.termDepositMapper.mapToDetailDto(this.termDepositService.save(existTermDeposit));
    }

    @Transactional
    public TermDeposit open(@NonNull Long id, @NonNull LocalDate openDate, @NonNull BigDecimal amount, User user, Boolean isReopen) {
        TermDeposit termDeposit = getExistingTermDepositById(id);
        this.checkByLocked(termDeposit);
        this.checkByStatus(termDeposit, TermDepositStatus.OPEN);

        this.termDepositValidator.validateOnOpen(amount, termDeposit, openDate);

        LocalDateTime openDateTime = openDate.atTime(DateHelper.getLocalTimeNow());
        termDeposit.setAccounts(this.termDepositAccountingService.createAccounts(termDeposit));
        termDeposit.setOpenedBy(userService.getCurrentUser());
        if (isReopen) {
            termDeposit.setReopenDate(openDateTime);
        } else {
            termDeposit.setOpenDate(openDateTime);
        }
        LocalDate closeDate = termDepositService.getExpiredDate(openDateTime, termDeposit.getTermAgreement());
        termDeposit.setCloseDate(closeDate.atTime(LocalTime.MAX));
        termDeposit.setStatus(TermDepositStatus.OPEN);

        this.updateDayClosureContract(termDeposit.getId(), termDeposit.getOpenDate().toLocalDate().plusDays(-1), user.getBranch());

        Currency currency = termDeposit.getTermDepositProduct().getCurrency();
        Account currentAccount = this.profileService.getCurrentAccountByCurrency(termDeposit.getProfile(), currency);
        Account termDepositAccount = this.termDepositAccountingService.getAccountByType(termDeposit.getAccounts(), TermDepositAccountType.PRINCIPAL);

        this.makeTransaction(termDeposit, openDateTime, currentAccount, termDepositAccount, termDeposit.getProfile().getBranch(), amount,
                TermDepositAction.TRANSACTION_AMOUNT_TO_TERM_DEPOSIT_ACCOUNT);

        termDeposit.setAmount(amount);

        return this.termDepositService.save(termDeposit);
    }

    public Page<TermDeposit> findAllByProfileId(@NonNull Long profileId, @NonNull Pageable pageable) {
        Optional<Profile> optionalProfile = this.profileService.findOne(profileId);
        if (!optionalProfile.isPresent()) {
            throw new ResourceNotFoundException(String.format("Profile with ID=%d is not found", profileId));
        }

        return termDepositService.findAllByProfile(optionalProfile.get(), pageable);
    }

    public TermDeposit lockAndUnlock(@NonNull Long termDepositId) {
        TermDeposit termDeposit = getExistingTermDepositById(termDepositId);
        if (termDeposit.getStatus() != TermDepositStatus.OPEN) {
            throw new RuntimeException("Can't be Lock/Unlock to this Term Deposit");
        }
        termDeposit.setLocked(!termDeposit.isLocked());
        return termDepositService.save(termDeposit);
    }

    public TermDeposit getById(@NonNull Long termDepositId) {
        return getExistingTermDepositById(termDepositId);
    }

    public Page<TermDepositSimplified> getAll(String searchString, Pageable pageable) {
        return termDepositService.getAllWithSearch(searchString, pageable);
    }

    public void makeTransaction(@NonNull TermDeposit termDeposit, @NonNull LocalDateTime operationTime,
                                @NonNull Account debitAccount, @NonNull Account creditAccount,
                                @NonNull Branch branch, @NonNull BigDecimal amount, @NonNull TermDepositAction termDepositAction) {
        AccountingEntry accountingEntry = accountingEntryService.getAccountingEntry(
                operationTime,
                amount,
                debitAccount,
                creditAccount,
                branch,
                termDepositAction.getMessage(),
                userService.getCurrentUser(),
                null
        );
        termDeposit.getAccountingEntries().add(this.accountingEntryService.create(accountingEntry));
    }

    private void checkByLocked(@NonNull TermDeposit termDeposit) {
        if (termDeposit.isLocked()) {
            throw new RuntimeException(String.format("Term Deposit is locked (ID=%d).", termDeposit.getId()));
        }
    }

    private void checkByStatus(@NonNull TermDeposit termDeposit, TermDepositStatus status) {
        if (termDeposit.getStatus() == status) {
            throw new RuntimeException(String.format("Term Deposit (ID=%d) should't be in %s status.", termDeposit.getId(), status));
        }
    }

    private void updateDayClosureContract(@NonNull Long contractId, @NonNull LocalDate date, Branch branch) {
        for (ProcessType containerType : this.termDepositContainer.getContractProcessTypes()) {
            this.dayClosureContractService.updateDayClosureContract(contractId, containerType, date, branch);
        }
    }

    public Page<AccountingEntry> getAccountingEntriesByTermDepositId(@NonNull Long termDepositId, @NonNull Pageable pageable) {
        TermDeposit termDeposit = getExistingTermDepositById(termDepositId);
        Page<TermDepositAccountingEntry> termDepositAccountingPage = termDepositAccountingEntryService.getPageableByTermDeposit(termDeposit, pageable);

        return new PageImpl(termDepositAccountingPage
                        .getContent()
                        .stream()
                        .map(x -> x.getAccountingEntry()).collect(Collectors.toList()), pageable, termDepositAccountingPage.getTotalElements());
    }

    public TermDeposit getExistingTermDepositById(@NonNull Long id) throws ResourceNotFoundException {
        Optional<TermDeposit> termDepositOptional = this.termDepositService.getOne(id);
        if (!termDepositOptional.isPresent()) {
            throw new ResourceNotFoundException(String.format("Term deposit is not found (ID=%d)", id));
        }

        return termDepositOptional.get();
    }

    @Async
    public void actualize(@NonNull TermDeposit termDeposit, @NonNull LocalDate date, User user) {
        termDepositActualizeService.actualizing(termDeposit, date, user);
    }
}
