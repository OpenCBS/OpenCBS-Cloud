package com.opencbs.loans.controllers;

import com.opencbs.core.controllers.BaseController;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.dto.RollbackParamDto;
import com.opencbs.core.dto.ScheduleDto;
import com.opencbs.core.dto.WriteOffCalculateDto;
import com.opencbs.core.dto.WriteOffDto;
import com.opencbs.core.dto.requests.EventRequest;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.ActualizeHelper;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.request.domain.Request;
import com.opencbs.core.request.domain.RequestType;
import com.opencbs.core.request.dto.RequestDto;
import com.opencbs.core.request.serivce.MakerCheckerWorker;
import com.opencbs.core.security.permissions.PermissionRequired;
import com.opencbs.core.services.ProfileService;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.domain.LoanEvent;
import com.opencbs.loans.domain.LoanSpecificProvision;
import com.opencbs.loans.domain.enums.ProvisionType;
import com.opencbs.loans.dto.*;
import com.opencbs.loans.mappers.LoanEventMapper;
import com.opencbs.loans.mappers.LoanMapper;
import com.opencbs.loans.mappers.LoanScheduleMapper;
import com.opencbs.loans.mappers.LoanSpecificProvisionMapper;
import com.opencbs.loans.services.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/loans")
@RequiredArgsConstructor
public class LoanController extends BaseController {

    private final LoanService loanService;
    private final LoanMapper loanMapper;
    private final LoanEventService loanEventService;
    private final LoanEventMapper loanEventMapper;
    private final LoanScheduleMapper loanScheduleMapper;
    private final ProfileService profileService;
    private final LoanOperationsService loanOperationsService;
    private final ActualizeLoanStarterService actualizeLoanStarterService;
    private final LoanWorker loanWorker;
    private final MakerCheckerWorker makerCheckerWorker;
    private final LoanSpecificProvisionService loanSpecificProvisionService;
    private final LoanSpecificProvisionMapper loanSpecificProvisionMapper;


    @GetMapping()
    @PermissionRequired(name = "GET_LOANS", moduleType = ModuleType.LOANS, description = "")
    public Page<SimplifiedLoanDto> get(@RequestParam(value = "search", required = false) String search, Pageable pageable) {
        return this.loanWorker.getAllLoans(search, pageable).map(simplifiedLoan->loanMapper.mapToDto(simplifiedLoan));
    }

    @GetMapping(value = "/{id}")
    @PermissionRequired(name = "GET_LOANS", moduleType = ModuleType.LOANS, description = "")
    public LoanDto get(@PathVariable long id) throws Exception {
        Loan loan = this.getLoan(id);
        LoanDto result = this.loanMapper.mapToDto(loan);
        result.setLoanAdditionalInfoEntity(loanService.getAdditionalInfo(id));
        return result;
    }

    @GetMapping(value = "/by-profile/{profileId}")
    public Page<LoanDto> getByProfile(@PathVariable(value = "profileId") long profileId, Pageable pageable) {
        Profile profile = this.profileService.findOne(profileId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Profile is not found (ID=%d).", profileId)));
        return this.loanWorker.getByProfile(pageable, profile);
    }

    @GetMapping(value = "/{loanId}/schedule")
    public ScheduleDto getSchedule(@PathVariable Long loanId) {
        return this.loanScheduleMapper.mapToScheduleDto(this.loanService.findSchedule(loanId), DateHelper.getLocalDateNow());
    }

    @GetMapping(value = "{loanId}/events")
    public List<LoanEventDto> getAllEvents(@PathVariable Long loanId, EventRequest request) {
        return this.loanEventService.findAllByLoanId(loanId, request)
                .stream()
                .map(x -> this.loanEventMapper.mapToDto(x))
                .collect(Collectors.toList());
    }

    @GetMapping(value = "{loanId}/events/group")
    public List<LoanEventDto> getAllEventsWithGroup(@PathVariable Long loanId, EventRequest request) {
        return this.loanEventService.findAllConsolidatedByLoanId(loanId, request)
                .stream()
                .sorted((a, b) -> {
                    int num = a.getEffectiveAt().compareTo(b.getEffectiveAt());
                    if (num == 0) {
                        return a.getId().compareTo(b.getId());
                    }
                    return num;
                })
                .map(x -> this.loanEventMapper.mapToDto(x))
                .collect(Collectors.toList());
    }

    @GetMapping(value = "{loanId}/events/{groupKey}")
    public List<LoanEventDto> getAllEventsByGroupKey(@PathVariable Long loanId,
                                                     @PathVariable Long groupKey) {
        return this.loanEventService.findAllByGroupKey(groupKey)
                .stream()
                .sorted(Comparator.comparing(LoanEvent::getId))
                .map(x -> this.loanEventMapper.mapToDto(x))
                .collect(Collectors.toList());
    }

    @PostMapping(value = "/{loanId}/roll-back")
    @PermissionRequired(name = "MAKER_FOR_LOAN_ROLLBACK", moduleType = ModuleType.MAKER_CHECKER, description = "")
    public RequestDto rollback(@PathVariable long loanId, @RequestBody RollbackParamDto dto) throws Exception {
        dto.setId(loanId);
        Request request = this.makerCheckerWorker.create(RequestType.LOAN_ROLLBACK, dto);
        RequestDto detailsDto = new RequestDto();
        detailsDto.setId(request.getId());
        return detailsDto;
    }

    private Loan getLoan(Long loanId) throws ResourceNotFoundException {
        return loanService.findOne(loanId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Loan is not found (ID=%d).", loanId)));
    }

    @PostMapping(value = "/{loanId}/write-off")
    @PermissionRequired(name = "LOAN_WRITE_OFF", moduleType = ModuleType.LOANS, description = "")
    public void writeOff(@PathVariable long loanId, @RequestBody WriteOffDto dto) {
        ActualizeHelper.isActualized(loanId, ModuleType.LOANS, dto.getDate().toLocalDate());
        this.loanOperationsService.writeOff(loanId, dto, UserHelper.getCurrentUser().getId());
    }

    @PostMapping(value = "/{loanId}/write-off/calculate")
    @PermissionRequired(name = "LOAN_WRITE_OFF", moduleType = ModuleType.LOANS, description = "")
    public WriteOffCalculateDto calculateForWriteOff(@PathVariable long loanId, @RequestBody WriteOffDto dto) {
        return this.loanOperationsService.calculateDto(loanId, dto);
    }

    @PostMapping(value = "/actualize/{loanId}")
    @PermissionRequired(name = "ACTUALIZE_LOAN", moduleType = ModuleType.LOANS, description = "")
    public String getActualizeLoanProgress(@PathVariable long loanId,
                                           @RequestParam(value = "date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        this.actualizeLoanStarterService.actualizing(loanId, date, UserHelper.getCurrentUser());
        return "Actualize loan started";
    }

    @GetMapping(value = "/{loanId}/specific-provision/{provisionType}")
    @PermissionRequired(name = "PROVISIONING", moduleType = ModuleType.LOANS, description = "")
    public SpecificProvisionInfoDto getInformationAboutSpecificProvision(@PathVariable Long loanId,
                                                                         @PathVariable ProvisionType provisionType) {
        return this.loanSpecificProvisionService.getInfoSpecificProvision(loanId, provisionType);
    }

    @GetMapping(value = "/{loanId}/recalculate-specific-provision/{value}/{provisionType}/by-percent")
    @PermissionRequired(name = "PROVISIONING", moduleType = ModuleType.LOANS, description = "")
    public BigDecimal recalculateSpecificProvisionByPercent(@PathVariable Long loanId, @PathVariable BigDecimal value,
                                                   @PathVariable ProvisionType provisionType) {
        ActualizeHelper.isActualized(loanId, ModuleType.LOANS, DateHelper.getLocalDateNow());
        return this.loanSpecificProvisionService.calculateReserve(loanId, value, provisionType);
    }

    @GetMapping(value = "/{loanId}/recalculate-specific-provision/{value}/{provisionType}/by-amount")
    @PermissionRequired(name = "PROVISIONING", moduleType = ModuleType.LOANS, description = "")
    public BigDecimal recalculateSpecificProvisionByAmount(@PathVariable Long loanId, @PathVariable BigDecimal value,
                                                   @PathVariable ProvisionType provisionType) {
        ActualizeHelper.isActualized(loanId, ModuleType.LOANS, DateHelper.getLocalDateNow());
        return this.loanSpecificProvisionService.calculatePercentByAmount(loanId, value, provisionType);
    }

    @PostMapping(value = "/apply-specific-provision")
    @PermissionRequired(name = "PROVISIONING", moduleType = ModuleType.LOANS, description = "")
    public void applySpecificProvision(@RequestBody SpecificProvisionApplyDto specificProvisionApplyDto) {
        final LoanSpecificProvision loanSpecificProvision = this.loanSpecificProvisionMapper.mapToEntity(specificProvisionApplyDto);
        this.loanSpecificProvisionService.applySpecificProvision(loanSpecificProvision);
    }

    @PostMapping(value = "{loanId}/reassign-loan-officer/{loanOfficerId}")
    @PermissionRequired(name = "REASSIGN_LOAN", moduleType = ModuleType.LOANS, description = "")
    public void reassignLoanOfficer(@PathVariable Long loanId, @PathVariable Long loanOfficerId) {
        this.loanService.findOne(loanId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Loan is not found (ID=%d).", loanId)));
        this.loanOperationsService.reassignLoanOfficer(Collections.singletonList(loanId), loanOfficerId);
    }
}
