package com.opencbs.loans.services;

import com.opencbs.core.dayclosure.contract.DayClosureContractService;
import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.*;
import com.opencbs.core.domain.profiles.Group;
import com.opencbs.core.domain.profiles.Person;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.domain.schedule.ScheduleParams;
import com.opencbs.core.dto.group.GroupMemberAmountsDto;
import com.opencbs.core.exceptions.ApiException;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.exceptions.UnauthorizedException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.services.EventGroupKeyService;
import com.opencbs.core.services.ProfileService;
import com.opencbs.core.services.audit.BaseHistoryService;
import com.opencbs.core.services.audit.HistoryService;
import com.opencbs.core.services.schedulegenerators.ScheduleService;
import com.opencbs.loans.annotations.CustomLoanApplicationService;
import com.opencbs.loans.credit.lines.domain.CreditLine;
import com.opencbs.loans.credit.lines.services.CreditLineService;
import com.opencbs.loans.domain.*;
import com.opencbs.loans.domain.enums.LoanApplicationStatus;
import com.opencbs.loans.domain.schedules.installments.LoanApplicationInstallment;
import com.opencbs.loans.dto.creditcommittee.CreditCommitteeVoteStatusChangeDto;
import com.opencbs.loans.mappers.LoanMapper;
import com.opencbs.loans.notificators.LoanNotificatorSender;
import com.opencbs.loans.repositories.LoanApplicationInstallmentRepository;
import com.opencbs.loans.repositories.LoanApplicationRepository;
import com.opencbs.loans.repositories.LoanInstallmentRepository;
import com.opencbs.loans.services.creditcommitteeservices.CreditCommitteeService;
import com.opencbs.loans.services.loancloseday.LoanAnalyticsDayClosureProcessor;
import com.opencbs.loans.services.loancloseday.LoanContainer;
import com.opencbs.loans.services.loancloseday.provisions.ProvisionOlb;
import lombok.NonNull;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;

import javax.persistence.DiscriminatorValue;
import javax.script.ScriptException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@ConditionalOnMissingBean(annotation = CustomLoanApplicationService.class)
public class LoanApplicationService extends BaseHistoryService<LoanApplicationRepository> implements HistoryService {

    private final LoanService loanService;
    private final LoanEventService loanEventService;
    private final LoanApplicationRepository loanApplicationRepository;
    private final LoanMapper loanMapper;
    private final EventGroupKeyService eventGroupKeyService;
    private final LoanInstallmentRepository loanInstallmentRepository;
    private final CreditCommitteeService creditCommitteeService;
    private final LoanAnalyticsDayClosureProcessor loanAnalyticsProcess;
    private final LoanAccountingService loanAccountingService;
    private final DayClosureContractService dayClosureContractService;
    private final GroupLoanApplicationService groupLoanApplicationService;
    private final ProfileService profileService;
    private final LoanContainer loanContainer;
    private final LoanApplicationInstallmentRepository loanApplicationInstallmentRepository;
    private final ScheduleService scheduleService;
    private final ModelMapper modelMapper = new ModelMapper();
    private final ProvisionService provisionService;
    private final ProvisionOlb provisionOlb;
    private final LoanApplicationCodeGenerator loanApplicationCodeGenerator;
    private final LoanNotificatorSender loanNotificatorSender;
    private final CreditLineService creditLineService;

    @Autowired
    public LoanApplicationService(LoanApplicationRepository loanApplicationRepository,
                                  ScheduleService scheduleService,
                                  LoanService loanService,
                                  LoanEventService loanEventService,
                                  LoanMapper loanMapper,
                                  EventGroupKeyService eventGroupKeyService,
                                  LoanInstallmentRepository loanInstallmentRepository,
                                  CreditCommitteeService creditCommitteeService,
                                  LoanAnalyticsDayClosureProcessor loanAnalyticsProcess,
                                  LoanAccountingService loanAccountingService,
                                  DayClosureContractService dayClosureContractService,
                                  GroupLoanApplicationService groupLoanApplicationService,
                                  ProfileService profileService,
                                  LoanContainer loanContainer,
                                  LoanApplicationInstallmentRepository loanApplicationInstallmentRepository,
                                  ProvisionService provisionService,
                                  ProvisionOlb provisionOlb,
                                  LoanApplicationCodeGenerator loanApplicationCodeGenerator,
                                  LoanNotificatorSender loanNotificatorSender,
                                  CreditLineService creditLineService) {
        super(loanApplicationRepository);
        this.loanApplicationRepository = loanApplicationRepository;
        this.loanService = loanService;
        this.loanMapper = loanMapper;
        this.eventGroupKeyService = eventGroupKeyService;
        this.loanInstallmentRepository = loanInstallmentRepository;
        this.creditCommitteeService = creditCommitteeService;
        this.loanAnalyticsProcess = loanAnalyticsProcess;
        this.loanEventService = loanEventService;
        this.loanAccountingService = loanAccountingService;
        this.dayClosureContractService = dayClosureContractService;
        this.groupLoanApplicationService = groupLoanApplicationService;
        this.profileService = profileService;
        this.loanContainer = loanContainer;
        this.loanApplicationInstallmentRepository = loanApplicationInstallmentRepository;
        this.scheduleService = scheduleService;
        this.provisionService = provisionService;
        this.provisionOlb = provisionOlb;
        this.loanApplicationCodeGenerator = loanApplicationCodeGenerator;
        this.loanNotificatorSender = loanNotificatorSender;
        this.creditLineService = creditLineService;
    }

    public Page<LoanApplication> findAll(Pageable pageable) {
        return this.loanApplicationRepository.findAll(pageable);
    }

    public Page<SimplifiedLoanApplication> findAllSimplified(String queryString, Pageable pageable) {
        return this.loanApplicationRepository.findAllSimplifiedLoanApplication(queryString, pageable, "createdAt", false);
    }

    public Page<SimplifiedLoanApplication> findAllSorted(String queryString, Pageable pageable, SortType sortType, Boolean isAsc) {
        return this.loanApplicationRepository.findAllSimplifiedLoanApplication(queryString, pageable, sortType.getName(), isAsc);
    }

    public Page<LoanApplication> findByProfile(Pageable pageable, Profile profile) {
        return this.loanApplicationRepository.findByProfile(pageable, profile);
    }

    public List<LoanApplication> findAllByProfile(Profile profile) {
        return this.loanApplicationRepository.findAllByProfile(profile);
    }

    public Optional<LoanApplication> findOne(long id) {
        return this.loanApplicationRepository.findById(id);
    }

    public Optional<LoanApplication> findOneByCode(String code) { return this.loanApplicationRepository.findLoanApplicationByCode(code); }

    public void save(LoanApplication loanApplication) {
        this.loanApplicationRepository.save(loanApplication);
    }

    public LoanApplication getLoanApplicationById(Long id) throws ResourceNotFoundException {
        LoanApplication loanApplication = this.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Loan application not found (ID=%d).", id)));
        loanApplication.getCreditCommitteeVotes().sort(Comparator.comparingLong(BaseEntity::getId));
        loanApplication.getLoanApplicationPayees().sort(Comparator.comparing(LoanApplicationPayees::getId));
        return loanApplication;
    }

    public List<LoanApplication> getAllByCreditLine(CreditLine creditLine) {
        return this.loanApplicationRepository.findAllByCreditLine(creditLine);
    }

    @Transactional
    public LoanApplication create(LoanApplication loanApplication, List<GroupMemberAmountsDto> amounts) throws ScriptException, ResourceNotFoundException {
        User currentUser = UserHelper.getCurrentUser();
        loanApplication.setCreatedBy(currentUser);
        loanApplication.setCreatedAt(DateHelper.getLocalDateTimeNow());
        loanApplication.setBranch(currentUser.getBranch());
        loanApplication.setId(null);
        loanApplication.setCode("");
        loanApplication.setInstallments(this.getDefaultSchedule(loanApplication));

        if (loanApplication.getCreditLine() != null) {
            LocalDate maturityDateCreditLine = loanApplication.getCreditLine().getMaturityDate();
            LocalDate maxMaturityDate = loanApplication.getInstallments()
                    .stream()
                    .max(Comparator.comparing(LoanApplicationInstallment::getNumber))
                    .get()
                    .getMaturityDate();
            Assert.isTrue(DateHelper.greaterOrEqual(maturityDateCreditLine, maxMaturityDate), "Loan application maturity date must be less or equal than Credit Line maturity date");
        }

        loanApplication = this.loanApplicationRepository.save(loanApplication);
        loanApplication.setCode(loanApplicationCodeGenerator.generateCode(loanApplication));
        loanApplication = this.loanApplicationRepository.save(loanApplication);
        String groupTypeOfProfile = Group.class.getAnnotation(DiscriminatorValue.class).value();

        if (loanApplication.getProfile().getType().equals(groupTypeOfProfile)) {
            this.saveLoanApplicationToMembersInGroup(loanApplication, amounts);
        }

        return loanApplication;
    }

    @Transactional
    public LoanApplication update(LoanApplication loanApplication) throws ResourceNotFoundException, ScriptException {
        loanApplication.setInstallments(this.getDefaultSchedule(loanApplication));
        loanApplication.setCode(loanApplicationCodeGenerator.generateCode(loanApplication));
        return this.loanApplicationRepository.save(loanApplication);
    }

    private void saveLoanApplicationToMembersInGroup(LoanApplication loanApplication, List<GroupMemberAmountsDto> amounts) {
        Group group = (Group) loanApplication.getProfile();
        for (GroupMemberAmountsDto memberAmount : amounts) {
            GroupLoanApplication groupLoanApplication = new GroupLoanApplication();
            groupLoanApplication.setGroup(group);
            Optional<Profile> member = this.profileService.getOne(memberAmount.getMemberId());
            if (!member.isPresent()) {
                throw new ApiException(HttpStatus.NOT_FOUND, "404", "Member is not found.");
            }
            if (!member.get().getType().equals(ProfileType.PERSON.toString())) {
                throw new ApiException(HttpStatus.NOT_ACCEPTABLE, "406", "Member must be a person.");
            }

            groupLoanApplication.setMember((Person) member.get());
            groupLoanApplication.setAmount(memberAmount.getAmount());
            groupLoanApplication.setLoanApplication(loanApplication);
            this.groupLoanApplicationService.save(groupLoanApplication);
        }
    }

    public List<LoanApplicationInstallment> schedulePreview(@NonNull LoanApplication loanApplication) throws ResourceNotFoundException {
        final List<LoanApplicationInstallment> loanApplicationInstallments =
                this.loanApplicationInstallmentRepository.findLoanApplicationInstallmentsByLoanApplication_Id(loanApplication.getId());
        if (!CollectionUtils.isEmpty(loanApplicationInstallments)) {
            return loanApplicationInstallments;
        }

        return getDefaultSchedule(loanApplication);
    }

    @Transactional
    public LoanApplication submit(LoanApplication loanApplication) {
        LoanApplication application = this.creditCommitteeService.submit(loanApplication);
        return this.loanApplicationRepository.save(application);
    }

    public LoanApplication changeStatus(LoanApplication loanApplication,
                                        CreditCommitteeVoteStatusChangeDto dto,
                                        User currentUser) throws UnauthorizedException, ResourceNotFoundException {
        return this.creditCommitteeService.process(loanApplication, dto, currentUser);
    }

    @Transactional(isolation = Isolation.READ_UNCOMMITTED)
    public LoanApplication disburse(LoanApplication loanApplication, User currentUser) throws Exception {
        loanApplication.setStatus(LoanApplicationStatus.DISBURSED);
        this.loanApplicationRepository.save(loanApplication);
        String groupTypeOfProfile = Group.class.getAnnotation(DiscriminatorValue.class).value();

        if (loanApplication.getProfile().getType().equals(groupTypeOfProfile)) {
            for (GroupLoanApplication groupLoanApplication : this.groupLoanApplicationService.findAllByLoanApplication(loanApplication)) {
                this.disburseForMember(loanApplication, currentUser, groupLoanApplication.getMember(), groupLoanApplication.getAmount());
            }
            loanApplication.setAmount(BigDecimal.ZERO); // todo because for member set amount to LA from loan and after all need to set default 0
            return loanApplication;
        }

        return this.disburseForMember(loanApplication, currentUser, loanApplication.getProfile(), loanApplication.getAmount());
    }

    private LoanApplication disburseForMember(LoanApplication loanApplication, User currentUser, Profile profile, BigDecimal amount) throws Exception {
        Loan oldLoan = this.loanService.findByLoanApplicationIdAndProfileId(loanApplication.getId(), profile.getId());
        Loan loan = this.loanMapper.getLoanFromLoanApplicationForDisburse(loanApplication, currentUser, amount);
        loan.setProfile(profile);

        if (oldLoan != null) {
            loan.setId(oldLoan.getId());
            loan = this.loanService.update(loan);
        } else {
            loan = this.loanService.create(loan);
        }

        this.makeOperationsForDisburseLoan(loan, currentUser);
        this.loanNotificatorSender.senLoanDisbursedNotification(loan);

        return loanApplication;
    }

    private void makeOperationsForDisburseLoan(Loan loan, User currentUser) throws Exception {
        LoanApplication loanApplication = loan.getLoanApplication();
        LoanEvent disbursementEvent = this.createLoanDisbursementEvent(loan, currentUser);

        if (loanApplication.getCreditLine() != null) {
            List<LoanApplication> loanApplications = this.getAllByCreditLine(loanApplication.getCreditLine())
                    .stream()
                    .filter(x -> x.getStatus().equals(LoanApplicationStatus.DISBURSED))
                    .collect(Collectors.toList());
            if (loanApplications.size() == 1) {
                this.createStructuringFees(loanApplication, loan.getId());
            }
            this.createCreditLineEntryFees(loanApplication, loan.getId());
        }
        else {
            this.createEntryFee(loan, currentUser);
        }

        this.saveLoanSchedule(loanApplication, loan, disbursementEvent);

        LoanInfo loanInfo = this.loanService.getLoanInfo(loan.getId(), loan.getDisbursementDate());
        this.provisionService.createReserve(loan, loanInfo, provisionOlb, LocalDateTime.of(loan.getDisbursementDate(), DateHelper.getLocalTimeNow()));

        this.loanAnalyticsProcess.processContract(loan.getId(), loan.getDisbursementDate(), currentUser);
        this.updateDayClosureContract(loan.getId(), disbursementEvent.getEffectiveAt().toLocalDate(), currentUser.getBranch());
    }

    private void createStructuringFees(LoanApplication loanApplication, Long loanId) {
        LoanEvent entryFeeEvent = new LoanEvent();
        CreditLine creditLine = this.creditLineService.getCreditLineById(loanApplication.getCreditLine().getId());
        entryFeeEvent.setAmount(creditLine.getCommittedAmount().multiply(creditLine.getStructuringFees().divide(BigDecimal.valueOf(100))));
        entryFeeEvent.setLoanId(loanId);
        entryFeeEvent.setEventType(EventType.STRUCTURING_FEE);
        entryFeeEvent.setCreatedAt(DateHelper.getLocalDateTimeNow());
        entryFeeEvent.setCreatedById(UserHelper.getCurrentUser().getId());
        entryFeeEvent.setEffectiveAt(LocalDateTime.of(loanApplication.getDisbursementDate(), DateHelper.getLocalTimeNow()));
        entryFeeEvent.setGroupKey(this.eventGroupKeyService.getNextEventGroupKey());
        this.loanEventService.saveWithoutAnalytic(entryFeeEvent);
    }

    private void createCreditLineEntryFees(LoanApplication loanApplication, Long loanId) {
        LoanEvent entryFeeEvent = new LoanEvent();
        CreditLine creditLine = this.creditLineService.getCreditLineById(loanApplication.getCreditLine().getId());
        entryFeeEvent.setAmount(loanApplication.getAmount().multiply(creditLine.getEntryFees().divide(BigDecimal.valueOf(100))));
        entryFeeEvent.setLoanId(loanId);
        entryFeeEvent.setEventType(EventType.CREDIT_LINE_ENTRY_FEE);
        entryFeeEvent.setCreatedAt(DateHelper.getLocalDateTimeNow());
        entryFeeEvent.setCreatedById(UserHelper.getCurrentUser().getId());
        entryFeeEvent.setEffectiveAt(LocalDateTime.of(loanApplication.getDisbursementDate(), DateHelper.getLocalTimeNow()));
        entryFeeEvent.setGroupKey(this.eventGroupKeyService.getNextEventGroupKey());
        this.loanEventService.saveWithoutAnalytic(entryFeeEvent);
    }

    private void updateDayClosureContract(@NonNull Long contractId, LocalDate date, Branch branch) {
        for (ProcessType containerType : loanContainer.getContractProcessTypes()) {
            if (!containerType.getModuleType().equals(ModuleType.LOANS))
                continue;

            this.dayClosureContractService.updateDayClosureContract(contractId, containerType, date, branch);
        }
    }

    private void createEntryFee(Loan loan, User currentUser) {
        LoanApplication loanApplication = loan.getLoanApplication();
        if (loanApplication.getLoanApplicationEntryFees() != null) {
            for (LoanApplicationEntryFee entryFee : loanApplication.getLoanApplicationEntryFees()) {
                LoanEvent entryFeeEvent = this.createEntryFeeDisbursementEvent(currentUser,
                        loanApplication,
                        loan.getId(),
                        entryFee.getAmount()
                );
                this.loanAccountingService.createEntryFeeAccountingEntry(entryFeeEvent, loan,
                        entryFee.getEntryFee(), String.format("Entry fee - %s", entryFee.getEntryFee().getName()));
                }

        }
    }

    private void saveLoanSchedule(LoanApplication loanApplication, Loan loan, LoanEvent disbursementEvent) {
        ModelMapper mapper = new ModelMapper();
        loanApplication.setAmount(loan.getAmount()); // todo need to generate new schedule for each member, but not for person and company
        getSchedule(loanApplication)
                .stream()
                .map(x -> {
                    LoanInstallment installment = mapper.map(x, LoanInstallment.class);
                    installment.setId(null);
                    installment.setLoanId(loan.getId());
                    installment.setPaidPrincipal(BigDecimal.ZERO);
                    installment.setPaidInterest(BigDecimal.ZERO);
                    installment.setEffectiveAt(disbursementEvent.getEffectiveAt());
                    installment.setEventGroupKey(disbursementEvent.getGroupKey());
                    installment.setRescheduled(false);
                    if (installment.getLastAccrualDate()==null) {
                        installment.setLastAccrualDate(installment.getMaturityDate());
                    }
                    return installment;
                })
                .forEach(this.loanInstallmentRepository::save);
    }

    private LoanEvent createLoanDisbursementEvent(Loan loan, User currentUser) throws Exception {
        LoanApplication loanApplication = loan.getLoanApplication();
        LoanEvent event = this.createDisbursementEvent(currentUser, loanApplication);
        event.setLoanId(loan.getId());
        event.setAmount(loan.getAmount());
        LoanEvent loanEvent = this.loanEventService.saveDisbursement(event);
        this.loanAccountingService.createLoanDisbursementAccountingEntry(loanEvent, loan, "Disbursement loan");
        return loanEvent;
    }

    private LoanEvent createEntryFeeDisbursementEvent(User currentUser,
                                                      LoanApplication loanApplication,
                                                      Long loanId,
                                                      BigDecimal amount) {
        LoanEvent entryFeeEvent = new LoanEvent();
        entryFeeEvent.setAmount(amount);
        entryFeeEvent.setLoanId(loanId);
        entryFeeEvent.setEventType(EventType.ENTRY_FEE_DISBURSEMENT);
        entryFeeEvent.setCreatedAt(DateHelper.getLocalDateTimeNow());
        entryFeeEvent.setCreatedById(currentUser.getId());
        entryFeeEvent.setEffectiveAt(LocalDateTime.of(loanApplication.getDisbursementDate(), DateHelper.getLocalTimeNow()));
        entryFeeEvent.setGroupKey(this.eventGroupKeyService.getNextEventGroupKey());
        this.loanEventService.saveWithoutAnalytic(entryFeeEvent);
        return entryFeeEvent;
    }

    private LoanEvent createDisbursementEvent(User currentUser, LoanApplication loanApplication) {
        LoanEvent loanDisbursementEvent = new LoanEvent();
        loanDisbursementEvent.setEventType(EventType.DISBURSEMENT);
        loanDisbursementEvent.setCreatedAt(DateHelper.getLocalDateTimeNow());
        loanDisbursementEvent.setCreatedById(currentUser.getId());
        loanDisbursementEvent.setEffectiveAt(LocalDateTime.of(loanApplication.getDisbursementDate(), DateHelper.getLocalTimeNow()));
        loanDisbursementEvent.setGroupKey(this.eventGroupKeyService.getNextEventGroupKey());
        return loanDisbursementEvent;
    }

    private List<LoanApplicationInstallment> getSchedule(@NonNull LoanApplication loanApplication) throws ResourceNotFoundException {
        return loanApplicationInstallmentRepository.findLoanApplicationInstallmentsByLoanApplication_Id(loanApplication.getId());
    }

    private List<LoanApplicationInstallment> getDefaultSchedule(@NonNull LoanApplication loanApplication) {
        return scheduleService.getSchedule(getScheduleParams(loanApplication))
                .stream()
                .map(x -> {
                    LoanApplicationInstallment loanApplicationInstallment = modelMapper.map(x, LoanApplicationInstallment.class);
                    loanApplicationInstallment.setLoanApplication(loanApplication);
                    return loanApplicationInstallment;
                })
                .collect(Collectors.toList());
    }

    private ScheduleParams getScheduleParams(@NonNull LoanApplication loanApplication) {
        ScheduleParams scheduleParams = modelMapper.map(loanApplication, ScheduleParams.class);
        scheduleParams.setScheduleBasedType(loanApplication.getLoanProduct().getScheduleBasedType());
        return scheduleParams;
    }

    public LoanApplication getByLoanId(long loanId) throws ResourceNotFoundException {
        Loan loan = this.loanService.findOne(loanId).orElseThrow(() -> new ResourceNotFoundException(String.format("Loan not found ID=%d.", loanId)));
        return loan.getLoanApplication();
    }

    @Override
    public Class getTargetClass() {
        return LoanApplication.class;
    }
}
