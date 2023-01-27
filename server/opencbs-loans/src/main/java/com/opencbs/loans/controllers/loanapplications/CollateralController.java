package com.opencbs.loans.controllers.loanapplications;

import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.security.permissions.PermissionRequired;
import com.opencbs.loans.domain.Collateral;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.dto.CollateralDetailDto;
import com.opencbs.loans.dto.CollateralDto;
import com.opencbs.loans.dto.CollateralUpdateDto;
import com.opencbs.loans.mappers.CollateralMapper;
import com.opencbs.loans.services.CollateralService;
import com.opencbs.loans.services.LoanApplicationService;
import com.opencbs.loans.validators.CollateralDtoValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.ResourceAccessException;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.web.bind.annotation.RequestMethod.*;

@RestController
@RequestMapping(value = "/api/loan-applications/{loanApplicationId}/collateral")
@SuppressWarnings("unused")
public class CollateralController {

    private final CollateralService collateralService;
    private final CollateralMapper collateralMapper;
    private final CollateralDtoValidator collateralDtoValidator;
    private final LoanApplicationService loanApplicationService;

    @Autowired
    public CollateralController(CollateralService collateralService,
                                CollateralMapper collateralMapper,
                                CollateralDtoValidator collateralDtoValidator,
                                LoanApplicationService loanApplicationService) {
        this.collateralService = collateralService;
        this.collateralMapper = collateralMapper;
        this.collateralDtoValidator = collateralDtoValidator;
        this.loanApplicationService = loanApplicationService;
    }

    @RequestMapping(method = GET)
    public List<CollateralDto> get(@PathVariable long loanApplicationId) {
        LoanApplication loanApplication = loanApplicationService.findOne(loanApplicationId)
                .orElseThrow(() -> new ResourceAccessException(String.format("Loan application not found (ID=%d).", loanApplicationId)));

        return this.collateralService.findAll(loanApplicationId)
                .stream()
                .map(this.collateralMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @RequestMapping(value = "/{id}", method = GET)
    public CollateralDetailDto getById(@PathVariable long loanApplicationId, @PathVariable long id) throws ResourceNotFoundException {
        LoanApplication loanApplication = loanApplicationService.findOne(loanApplicationId)
                .orElseThrow(() -> new ResourceAccessException(String.format("Loan application not found (ID=%d).", loanApplicationId)));

        Collateral collateral = this.collateralService
                .findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Collateral not found (ID=%d).", id)));

        if(!loanApplication.getId().equals(collateral.getLoanApplication().getId()))
            throw new ResourceNotFoundException("Collateral belongs to another loan application.");

        return collateralMapper.mapWithCustomFields(collateral);
    }

    @RequestMapping(method = POST)
    @PermissionRequired(name = "COLLATERAL", moduleType = ModuleType.LOAN_APPLICATIONS, description = "")
    public CollateralDetailDto post(@PathVariable long loanApplicationId,
                                    @RequestBody CollateralUpdateDto collateralUpdateDto) {
        LoanApplication loanApplication = loanApplicationService.findOne(loanApplicationId)
                .orElseThrow(() -> new ResourceAccessException(String.format("Loan application not found (ID=%d).", loanApplicationId)));
        this.collateralDtoValidator.validate(collateralUpdateDto);

        User currentUser = UserHelper.getCurrentUser();
        Collateral collateral = this.collateralMapper.mapToEntity(collateralUpdateDto, currentUser);
        collateral.setCreatedBy(currentUser);
        collateral.setCreatedAt(DateHelper.getLocalDateTimeNow());
        collateral.setLoanApplication(loanApplication);
        collateral = this.collateralService.create(collateral);
        return this.collateralMapper.mapWithCustomFields(collateral);
    }

    @RequestMapping(value = "/{id}", method = PUT)
    @PermissionRequired(name = "COLLATERAL", moduleType = ModuleType.LOAN_APPLICATIONS, description = "")
    public CollateralDetailDto put(@PathVariable long loanApplicationId, @PathVariable long id, @RequestBody CollateralUpdateDto collateralUpdateDto) {
        LoanApplication loanApplication = loanApplicationService.findOne(loanApplicationId)
                .orElseThrow(() -> new ResourceAccessException(String.format("Loan application not found (ID=%d).", loanApplicationId)));
        Collateral collateral = this.collateralService
                .findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Collateral not found (ID=%d).", id)));

        if(!loanApplication.getId().equals(collateral.getLoanApplication().getId()))
            throw new ResourceNotFoundException("Collateral belongs to another loan application.");

        collateralUpdateDto.setId(id);
        this.collateralDtoValidator.validate(collateralUpdateDto);

        collateral = this.collateralService.update(this.collateralMapper.zip(collateral, collateralUpdateDto));
        return this.collateralMapper.mapWithCustomFields(collateral);
    }

    @RequestMapping(value = "/{id}", method = DELETE)
    @PermissionRequired(name = "COLLATERAL", moduleType = ModuleType.LOAN_APPLICATIONS, description = "")
    public void delete(@PathVariable long id) {
        Collateral collateral = this.collateralService
                .findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Collateral not found (ID=%d).", id)));
        collateral.setClosedAt(DateHelper.getLocalDateTimeNow());
        collateral.setClosedBy(UserHelper.getCurrentUser());
        this.collateralService.update(collateral);
    }
}
