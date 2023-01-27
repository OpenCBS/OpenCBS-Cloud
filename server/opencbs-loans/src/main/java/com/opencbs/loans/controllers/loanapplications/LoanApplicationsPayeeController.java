package com.opencbs.loans.controllers.loanapplications;

import com.opencbs.core.dto.PayeeEventDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.mappers.PayeeEventMapper;
import com.opencbs.core.services.PayeeEventService;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.domain.LoanApplicationPayees;
import com.opencbs.loans.dto.loanapplications.LoanApplicationPayeesDto;
import com.opencbs.loans.dto.loanapplications.LoanApplicationPayeesUpdateDto;
import com.opencbs.loans.mappers.LoanApplicationPayeeMapper;
import com.opencbs.loans.services.LoanApplicationService;
import com.opencbs.loans.services.LoanApplicationsPayeesService;
import com.opencbs.loans.validators.LoanApplicationPayeesValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/api/loan-applications")
public class LoanApplicationsPayeeController {
    private final LoanApplicationService loanApplicationService;
    private final LoanApplicationsPayeesService loanApplicationsPayeesService;
    private final LoanApplicationPayeeMapper loanApplicationPayeeMapper;
    private final LoanApplicationPayeesValidator loanApplicationPayeesValidator;
    private final PayeeEventService payeeEventService;
    private final PayeeEventMapper payeeEventMapper;

    @Autowired
    public LoanApplicationsPayeeController(LoanApplicationService loanApplicationService,
                                           LoanApplicationsPayeesService loanApplicationsPayeesService,
                                           LoanApplicationPayeeMapper loanApplicationPayeeMapper,
                                           LoanApplicationPayeesValidator loanApplicationPayeesValidator,
                                           PayeeEventService payeeEventService,
                                           PayeeEventMapper payeeEventMapper) {
        this.loanApplicationService = loanApplicationService;
        this.loanApplicationsPayeesService = loanApplicationsPayeesService;
        this.loanApplicationPayeeMapper = loanApplicationPayeeMapper;
        this.loanApplicationPayeesValidator = loanApplicationPayeesValidator;
        this.payeeEventService = payeeEventService;
        this.payeeEventMapper = payeeEventMapper;
    }

    @PostMapping(value = "/{loanApplicationId}/payees")
    public void createLoanApplicationPayee(@PathVariable Long loanApplicationId,
                                           @RequestBody LoanApplicationPayeesDto loanApplicationPayeesDto,
                                           @RequestParam(value = "payeeId") Long payeeId) throws Exception {
        this.loanApplicationsPayeesService.createLoanApplicationPayee(loanApplicationId, loanApplicationPayeesDto, payeeId);
    }

    @PutMapping(value = "/{loanApplicationId}/payees/{payeeId}/disburse")
    public LoanApplicationPayeesUpdateDto disbursePayee(@PathVariable(value = "loanApplicationId") long loanApplicationId,
                                                        @PathVariable(value = "payeeId") long payeeId,
                                                        @RequestBody LoanApplicationPayeesDto dto,
                                                        @RequestParam(value = "checknumber") String check) {
        LoanApplication loanApplication = this.loanApplicationService.getLoanApplicationById(loanApplicationId);
        this.loanApplicationPayeesValidator.validate(dto, loanApplication);
        LoanApplicationPayees payee = this.getById(payeeId);
        this.loanApplicationPayeesValidator.disburseValidate(payee, check);
        LoanApplicationPayees finalPayee = payee;
        if (loanApplication.getLoanApplicationPayees().stream().noneMatch(x -> x.equals(finalPayee))) {
            throw new ResourceNotFoundException("Payee belongs to another loan application");
        }
        payee = this.loanApplicationPayeeMapper.zip(payee, dto);
        payee.setId(payeeId);
        this.loanApplicationsPayeesService.createLoanApplicationPayeeDisbursementEvent(payee, UserHelper.getCurrentUser(), check);
        return this.loanApplicationPayeeMapper.mapToDto(this.loanApplicationsPayeesService.update(payee));
    }

    @PostMapping(value = "/payees/{payeeId}/refund")
    public LoanApplicationPayeesUpdateDto refundPayee(@PathVariable(value = "payeeId") long payeeId,
                                                      @RequestBody LoanApplicationPayeesDto dto){
        LoanApplicationPayees payee = this.getById(payeeId);
        this.loanApplicationPayeesValidator.refundValidate(payee);
        this.loanApplicationsPayeesService.createLoanApplicationPayeeRefundEvent(payee, UserHelper.getCurrentUser(), dto);
        payee = this.loanApplicationPayeeMapper.refund(payee, dto);
        payee.setId(payeeId);
        return this.loanApplicationPayeeMapper.mapToDto(this.loanApplicationsPayeesService.update(payee));
    }

    @DeleteMapping(value = "/{loanApplicationId}/payees")
    public void deleteLoanApplicationPayee(@PathVariable Long loanApplicationId,
                                           @RequestParam(value = "loanApplicationPayeesId") Long loanApplicationPayeesId) throws Exception {
        this.loanApplicationService.getLoanApplicationById(loanApplicationId);
        this.loanApplicationsPayeesService.deleteLoanApplicationPayee(loanApplicationPayeesId, UserHelper.getCurrentUser());
    }

    @GetMapping(value = "/loan-application-payee/{payeeId}")
    public LoanApplicationPayeesUpdateDto get(@PathVariable Long payeeId) {
        LoanApplicationPayees payee = this.getById(payeeId);
        return this.loanApplicationPayeeMapper.mapToDto(payee);
    }

    @GetMapping(value = "/loan-application-payee-events/{payeeId}")
    public List<PayeeEventDto> getPayeeEvents(@PathVariable Long payeeId) {
        List<PayeeEventDto> payeeEventDto = this.payeeEventService.findAllByLoanApplicationPayee(payeeId)
                .stream()
                .map(x -> this.payeeEventMapper.mapToDto(x))
                .collect(Collectors.toList());
        return payeeEventDto;
    }

    private LoanApplicationPayees getById(Long id){
        return this.loanApplicationsPayeesService.getById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Loan Application Payee is not found (ID=%d).", id)));
    }
}
