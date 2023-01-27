package com.opencbs.loans.controllers.loanapplications;

import com.opencbs.core.controllers.BaseController;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.dto.profiles.ProfileDto;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.security.permissions.PermissionRequired;
import com.opencbs.loans.domain.Guarantor;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.dto.GuarantorDetailDto;
import com.opencbs.loans.dto.GuarantorDto;
import com.opencbs.loans.mappers.GuarantorMapper;
import com.opencbs.loans.services.GuarantorService;
import com.opencbs.loans.services.LoanApplicationService;
import com.opencbs.loans.validators.GuarantorDtoValidator;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.ResourceAccessException;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

@RestController
@RequestMapping(value = "/api/loan-applications/{loanApplicationId}/guarantors")
@SuppressWarnings("/unused/")
public class GuarantorController extends BaseController {

    private final LoanApplicationService loanApplicationService;
    private final GuarantorService guarantorService;
    private final GuarantorMapper guarantorMapper;
    private final GuarantorDtoValidator guarantorDtoValidator;

    @Autowired
    public GuarantorController(GuarantorService guarantorService,
                               GuarantorMapper guarantorMapper,
                               LoanApplicationService loanApplicationService,
                               GuarantorDtoValidator guarantorDtoValidator) {
        this.guarantorService = guarantorService;
        this.guarantorMapper = guarantorMapper;
        this.loanApplicationService = loanApplicationService;
        this.guarantorDtoValidator = guarantorDtoValidator;
    }

    @RequestMapping(method = RequestMethod.GET)
    public List<GuarantorDetailDto> get(@PathVariable long loanApplicationId) {
        LoanApplication loanApplication = this.loanApplicationService
                .findOne(loanApplicationId)
                .orElseThrow(() -> new ResourceAccessException(String.format("Loan application not found (ID=%d).", loanApplicationId)));

        return this.guarantorService.findAll(loanApplication)
                .stream()
                .map(this.guarantorMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @RequestMapping(value = "/{guarantorId}", method = RequestMethod.GET)
    public GuarantorDetailDto getById(@PathVariable long guarantorId,
                                      @PathVariable long loanApplicationId) throws Exception {
        LoanApplication loanApplication = this.loanApplicationService.findOne(loanApplicationId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Loan application not found (ID=%d).", loanApplicationId)));

        Guarantor guarantor = this.guarantorService.findOne(guarantorId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Guarantor not found (ID=%d).", guarantorId)));

        if (!loanApplication.getId().equals(guarantor.getLoanApplication().getId())) {
            throw new ResourceNotFoundException("Guarantor belongs to another loan application.");
        }
        return this.guarantorMapper.mapToDto(guarantor);
    }

    @RequestMapping(method = POST)
    @PermissionRequired(name = "GUARANTOR", moduleType = ModuleType.LOAN_APPLICATIONS, description = "")
    public GuarantorDetailDto post(@PathVariable long loanApplicationId,
                                   @RequestBody GuarantorDto guarantorDto) throws Exception {
        LoanApplication loanApplication = this.loanApplicationService
                .findOne(loanApplicationId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Loan application not found (ID=%d).", loanApplicationId)));
        this.guarantorDtoValidator.validate(guarantorDto);
        Guarantor guarantor = this.guarantorMapper.mapToEntity(guarantorDto);
        guarantor.setLoanApplication(loanApplication);
        guarantor.setCreatedAt(DateHelper.getLocalDateTimeNow());
        guarantor.setCreatedBy(UserHelper.getCurrentUser());
        return this.guarantorMapper.mapToDto(this.guarantorService.create(guarantor));
    }

    @RequestMapping(value = "/{guarantorId}", method = RequestMethod.PUT)
    @PermissionRequired(name = "GUARANTOR", moduleType = ModuleType.LOAN_APPLICATIONS, description = "")
    public GuarantorDetailDto put(@RequestBody GuarantorDto guarantorDto,
                                  @PathVariable long loanApplicationId,
                                  @PathVariable long guarantorId) throws Exception {
        LoanApplication loanApplication = this.loanApplicationService
                .findOne(loanApplicationId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Loan application not found (ID=%d).", loanApplicationId)));
        Guarantor oldGuarantor = this.guarantorService
                .findOne(guarantorId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Guarantor not found (ID=%d).", guarantorId)));
        if (!loanApplication.getId().equals(oldGuarantor.getLoanApplication().getId())) {
            throw new ResourceNotFoundException("Guarantor belongs to another loan application.");
        }

        this.guarantorDtoValidator.validate(guarantorDto);
        Guarantor guarantor = this.guarantorMapper.mapToEntity(guarantorDto);
        guarantor.setId(guarantorId);
        guarantor.setCreatedBy(UserHelper.getCurrentUser());
        guarantor.setLoanApplication(loanApplication);
        return this.guarantorMapper.mapToDto(this.guarantorService.update(guarantor));
    }

    @RequestMapping(value = "/{guarantorId}", method = RequestMethod.DELETE)
    @PermissionRequired(name = "GUARANTOR", moduleType = ModuleType.LOAN_APPLICATIONS, description = "")
    public void delete(@PathVariable long guarantorId) throws Exception {
        Guarantor guarantor = this.guarantorService
                .findOne(guarantorId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Guarantor not found (ID=%d).", guarantorId)));

        guarantor.setClosedAt(DateHelper.getLocalDateTimeNow());
        guarantor.setClosedBy(UserHelper.getCurrentUser());
        this.guarantorService.update(guarantor);
    }

    @RequestMapping(value = "/lookup", method = GET)
    public Page<ProfileDto> lookup(@PathVariable long loanApplicationId, @RequestParam(value = "search", required = false) String query, Pageable pageable) throws ResourceNotFoundException {
        LoanApplication loanApplication = this.loanApplicationService
                .findOne(loanApplicationId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Loan application not found (ID=%d).", loanApplicationId)));
        ModelMapper mapper = new ModelMapper();
        return this.guarantorService.findAvailableProfiles(query, loanApplication, pageable).map(x -> mapper.map(x, ProfileDto.class));
    }
}