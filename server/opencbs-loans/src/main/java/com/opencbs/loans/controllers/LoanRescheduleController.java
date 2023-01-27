package com.opencbs.loans.controllers;

import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.dto.ManualEditRescheduleDto;
import com.opencbs.core.dto.RescheduleDto;
import com.opencbs.core.dto.ScheduleDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.mappers.ScheduleMapper;
import com.opencbs.core.security.permissions.PermissionRequired;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.dto.LoanDto;
import com.opencbs.loans.mappers.LoanMapper;
import com.opencbs.loans.mappers.LoanScheduleMapper;
import com.opencbs.loans.services.LoanInstallmentsService;
import com.opencbs.loans.services.LoanService;
import com.opencbs.loans.services.loanreschedule.LoanRescheduleService;
import com.opencbs.loans.validators.LoanRescheduleValidator;
import com.opencbs.loans.workers.LoanRescheduleWorker;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "/api/loans/{loanId}/reschedule")
public class LoanRescheduleController {

    private final LoanService loanService;
    private final LoanRescheduleService rescheduleService;
    private final LoanScheduleMapper loanScheduleMapper;
    private final LoanRescheduleValidator loanRescheduleValidator;
    private final LoanMapper loanMapper;
    private final LoanRescheduleWorker loanRescheduleWorker;
    private final LoanInstallmentsService loanInstallmentsService;
    private final ScheduleMapper scheduleMapper;


    @PermissionRequired(name = "LOAN_RESCHEDULE", moduleType = ModuleType.LOANS, description = "")
    @PostMapping(value = "/preview")
    public ScheduleDto preview(@PathVariable long loanId, @RequestBody RescheduleDto rescheduleDto) throws Exception {
        Loan loan = this.loanService.findOne(loanId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Loan not found (ID=%d).", loanId)));
        this.loanRescheduleValidator.validate(rescheduleDto, loan);
        return this.loanScheduleMapper.mapToScheduleDto(this.rescheduleService.preview(loan, rescheduleDto), rescheduleDto.getRescheduleDate());
    }

    @PermissionRequired(name = "LOAN_RESCHEDULE", moduleType = ModuleType.LOANS, description = "")
    @PostMapping(value = "/apply")
    public LoanDto reschedule( @PathVariable long loanId, @RequestBody ManualEditRescheduleDto manualEditRescheduleDto) {
        Loan loan = this.loanService
                .findOne(loanId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Loan not found (ID=%d).", loanId)));
        this.loanRescheduleValidator.validate(manualEditRescheduleDto.getRescheduleDto(), loan);
        this.loanInstallmentsService.validate(loan, manualEditRescheduleDto);
        this.loanRescheduleWorker.makeReschedule(loan, manualEditRescheduleDto);
        return this.loanMapper.mapToDto(loan);
    }

    @PermissionRequired(name = "LOAN_RESCHEDULE", moduleType = ModuleType.LOANS, description = "")
    @PutMapping(value = "/validate")
    public ScheduleDto preview( @PathVariable long loanId, @RequestBody ManualEditRescheduleDto manualEditRescheduleDto) {
        return this.loanInstallmentsService.preview(loanId, manualEditRescheduleDto);
    }
}
