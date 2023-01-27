package com.opencbs.loans.controllers.loanapplications;

import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.domain.enums.SortType;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.dto.BaseDto;
import com.opencbs.core.dto.DataForEntryFeeCalculationDto;
import com.opencbs.core.dto.EntryFeeDto;
import com.opencbs.core.dto.ScheduleDto;
import com.opencbs.core.dto.audit.HistoryDto;
import com.opencbs.core.exceptions.ForbiddenException;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.mappers.ScheduleMapper;
import com.opencbs.core.repositories.ProfileAccountRepository;
import com.opencbs.core.request.domain.Request;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.dto.RequestDto;
import com.opencbs.core.request.serivce.MakerCheckerWorker;
import com.opencbs.core.security.permissions.PermissionRequired;
import com.opencbs.core.services.ProfileService;
import com.opencbs.core.services.UserService;
import com.opencbs.core.services.entryfeecalculation.EntryFeeCalculationService;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.domain.enums.LoanApplicationStatus;
import com.opencbs.loans.dto.LoanApplicationDto;
import com.opencbs.loans.dto.creditcommittee.CreditCommitteeVoteStatusChangeDto;
import com.opencbs.loans.dto.loanapplications.LoanApplicationCreateDto;
import com.opencbs.loans.mappers.LoanApplicationMapper;
import com.opencbs.loans.mappers.LoanScheduleMapper;
import com.opencbs.loans.services.LoanApplicationInstallmentsService;
import com.opencbs.loans.services.LoanApplicationService;
import com.opencbs.loans.validators.CreditCommitteeVoteStatusChangeDtoValidator;
import com.opencbs.loans.validators.LoanApplicationValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

import javax.script.ScriptException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping(value = "/api/loan-applications")
@RequiredArgsConstructor
public class LoanApplicationController {

    private final LoanApplicationService loanApplicationService;
    private final LoanApplicationMapper loanApplicationMapper;
    private final LoanApplicationValidator loanApplicationValidator;
    private final CreditCommitteeVoteStatusChangeDtoValidator creditCommitteeVoteStatusChangeDtoValidator;
    private final EntryFeeCalculationService entryFeeCalculationService;
    private final LoanScheduleMapper loanScheduleMapper;
    private final ProfileService profileService;
    private final MakerCheckerWorker makerCheckerWorker;
    private final LoanApplicationInstallmentsService loanApplicationInstallmentsService;
    private final ScheduleMapper scheduleMapper;
    private final UserService userService;
    private final ProfileAccountRepository profileAccountRepository;


    @PostMapping()
    @PermissionRequired(name = "CREATE_LOAN_APPLICATION", moduleType = ModuleType.LOAN_APPLICATIONS, description = "")
    public LoanApplicationDto post(@RequestBody LoanApplicationCreateDto dto) throws Exception {
        User loanOfficer = this.userService.findById(dto.getUserId()).orElseThrow(
                () -> new ResourceNotFoundException(String.format("User not found (ID=%d).", dto.getUserId())));
        this.loanApplicationValidator.validateOnCreate(dto);
        LoanApplication loanApplication = this.loanApplicationMapper.createMapToEntity(dto);
        loanApplication.setLoanOfficer(loanOfficer);

        return this.loanApplicationMapper
                .mapToDtoWithExtraFields(this.loanApplicationService.create(loanApplication, dto.getAmounts()));
    }

    @PutMapping(value = "/{id}")
    @PermissionRequired(name = "UPDATE_LOANS_APPLICATIONS", moduleType = ModuleType.LOAN_APPLICATIONS, description = "")
    public LoanApplicationDto edit(@RequestBody LoanApplicationCreateDto dto, @PathVariable long id) throws ScriptException {
        this.loanApplicationValidator.validateOnUpdate(dto);
        LoanApplication loanApplication = this.loanApplicationService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Loan application not found (ID=%d).", id)));
        if (!loanApplication.getStatus().equals(LoanApplicationStatus.IN_PROGRESS)) {
            throw new ForbiddenException("Loan application edit is possible if only status is in progress.");
        }
        loanApplication = this.loanApplicationMapper.zip(loanApplication, dto);
        loanApplication.setId(id);
        return this.loanApplicationMapper.mapToDtoWithExtraFields(this.loanApplicationService.update(loanApplication));
    }

    @GetMapping()
    @PermissionRequired(name = "GET_LOANS_APPLICATIONS", moduleType = ModuleType.LOAN_APPLICATIONS, description = "")
    public Page<LoanApplicationDto> get(@RequestParam(value = "search", required = false) String search, Pageable pageable) {
        return this.loanApplicationService.findAllSimplified(search, pageable).map(this.loanApplicationMapper::mapToDtoSimplified);
    }

    @GetMapping(value = "/sorted")
    @PermissionRequired(name = "GET_LOANS_APPLICATIONS", moduleType = ModuleType.LOAN_APPLICATIONS, description = "")
    public Page<LoanApplicationDto> getSorted(@RequestParam(value = "search", required = false) String search, Pageable pageable, SortType sortType, Boolean isAsc) {
        return this.loanApplicationService.findAllSorted(search, pageable, sortType, isAsc).map(this.loanApplicationMapper::mapToDtoSimplified);
    }

    @GetMapping(value = "/by-profile/{profileId}")
    @PermissionRequired(name = "GET_LOANS_APPLICATIONS", moduleType = ModuleType.LOAN_APPLICATIONS, description = "")
    public Page<LoanApplicationDto> getByProfile(Pageable pageable, @PathVariable(value = "profileId") Long profileId) throws ResourceNotFoundException {
        Profile profile = this.profileService.getOne(profileId).orElseThrow(() -> new ResourceNotFoundException(String.format("Profile not found (ID=%d).", profileId)));
        return this.loanApplicationService.findByProfile(pageable, profile).map(this.loanApplicationMapper::mapToDto);
    }

    @GetMapping(value = "/{id}")
    @PermissionRequired(name = "GET_LOANS_APPLICATIONS", moduleType = ModuleType.LOAN_APPLICATIONS, description = "")
    public LoanApplicationDto get(@PathVariable long id) {
        LoanApplication loanApplication = this.loanApplicationService.getLoanApplicationById(id);
        return this.loanApplicationMapper.mapToDtoWithExtraFields(loanApplication);
    }

    @PostMapping(value = "/{id}/preview")
    public ScheduleDto schedulePreview(@PathVariable long id, @RequestBody LoanApplicationCreateDto dto) {
        loanApplicationValidator.validateOnCreate(dto);
        LoanApplication loanApplication = loanApplicationMapper.createMapToEntity(dto);
        loanApplication.setId(id);
        return loanScheduleMapper.mapLoanApplicationInstallmentsToScheduleDto(loanApplicationService.schedulePreview(loanApplication));
    }

    @PostMapping(value = "/preview")
    public ScheduleDto defaultSchedulePreview(@RequestBody LoanApplicationCreateDto dto) {
        loanApplicationValidator.validateOnCreate(dto);
        LoanApplication loanApplication = loanApplicationMapper.createMapToEntity(dto);
        return loanScheduleMapper.mapLoanApplicationInstallmentsToScheduleDto(loanApplicationService.schedulePreview(loanApplication));
    }

    @PutMapping("/{id}/schedule-update-validate")
    public ScheduleDto validateSchedule(@PathVariable Long id, @RequestBody ScheduleDto scheduleDto) throws ResourceNotFoundException{
        return loanApplicationInstallmentsService.preview(id, scheduleMapper.mapScheduleDtoToInstallments(scheduleDto));
    }

    @PutMapping(value = "/{id}/schedule-update")
    public ScheduleDto updateSchedule(@PathVariable Long id, @RequestBody ScheduleDto scheduleDto) throws ResourceNotFoundException{
        return loanApplicationInstallmentsService.update(id, scheduleMapper.mapScheduleDtoToInstallments(scheduleDto));
    }

    @PostMapping(value = "/{id}/change-status")
    @PermissionRequired(name = "CHANGE_STATUS_OF_LOANS_APPLICATIONS", moduleType = ModuleType.LOAN_APPLICATIONS, description = "")
    public void changeStatus(@PathVariable long id,
                             @RequestBody CreditCommitteeVoteStatusChangeDto dto) {
        LoanApplication loanApplication = this.loanApplicationService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Loan application not found (ID=%d).", id)));
        this.creditCommitteeVoteStatusChangeDtoValidator.validate(dto);
        this.loanApplicationService.changeStatus(loanApplication, dto, UserHelper.getCurrentUser());
    }

    @PostMapping(value = "/{id}/submit")
    @PermissionRequired(name = "SUBMIT_LOANS_APPLICATIONS", moduleType = ModuleType.LOAN_APPLICATIONS, description = "")
    public LoanApplicationDto submit(@PathVariable long id) {
        LoanApplication loanApplication = this.loanApplicationService.getLoanApplicationById(id);

        if (!loanApplication.getStatus().equals(LoanApplicationStatus.IN_PROGRESS)) {
            throw new ForbiddenException("Loan application submit is possible if only status is IN_PROGRESS.");
        }

        loanApplication = this.loanApplicationService.submit(loanApplication);
        return this.loanApplicationMapper.mapToDtoWithExtraFields(loanApplication);
    }

    @PostMapping(value = "/{id}/disburse")
    @PermissionRequired(name = "MAKER_FOR_LOAN_DISBURSEMENT", moduleType = ModuleType.MAKER_CHECKER, description = "")
    public RequestDto disburse(@PathVariable long id) throws Exception {
        LoanApplication loanApplication = this.loanApplicationService.getLoanApplicationById(id);
        if (!loanApplication.getStatus().equals(LoanApplicationStatus.APPROVED)) {
            throw new ForbiddenException("Loan application is not approved yet.");
        }
        Assert.isTrue(this.profileAccountRepository.findByProfileIdAndAccount_Currency_Id(loanApplication.getProfile().getId(), loanApplication.getCurrencyId()).isPresent(),
                "Profile does not have current account with appropriate currency");
        BaseDto dto = new BaseDto();
        dto.setId(id);
        Request request = this.makerCheckerWorker.create(RequestType.LOAN_DISBURSEMENT, dto);
        RequestDto detailsDto = new RequestDto();
        detailsDto.setId(request.getId());
        return detailsDto;
    }

    @PostMapping(value = "/calculate-entry-fee")
    public List<EntryFeeDto> calculateDataForEntryFee(@RequestBody DataForEntryFeeCalculationDto dto) {
        return this.entryFeeCalculationService.calculate(dto);
    }

    @GetMapping(value = "/{id}/history")
    public List<HistoryDto> getHistory(@PathVariable Long id) throws Exception {
        this.loanApplicationService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Loan Application not found(ID=%d).", id)));
        return loanApplicationService.getAllRevisions(id);
    }

    @GetMapping(value = "/{id}/history/last_change")
    public HistoryDto getLastChange(@PathVariable Long id, @RequestParam(value = "dateTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)LocalDateTime dateTime) throws Exception {
        this.loanApplicationService.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Loan Application not found(ID=%d).", id)));
        return loanApplicationService.getRevisionByDate(id, dateTime);
    }
}
