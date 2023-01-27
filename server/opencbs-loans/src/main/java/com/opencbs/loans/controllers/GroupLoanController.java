package com.opencbs.loans.controllers;

import com.opencbs.core.controllers.BaseController;
import com.opencbs.core.domain.profiles.Group;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.services.ProfileService;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.dto.LoanDto;
import com.opencbs.loans.services.LoanApplicationService;
import com.opencbs.loans.services.LoanWorker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.DiscriminatorValue;

@RestController
@RequestMapping(value = "/api/group-loans")
public class GroupLoanController extends BaseController {

    private final ProfileService profileService;
    private final LoanWorker loanWorker;
    private final LoanApplicationService loanApplicationService;

    @Autowired
    public GroupLoanController(ProfileService profileService,
                               LoanWorker loanWorker,
                               LoanApplicationService loanApplicationService) {
        this.profileService = profileService;
        this.loanWorker = loanWorker;
        this.loanApplicationService = loanApplicationService;
    }

    @GetMapping(value = "/{loanApplicationId}")
    public LoanDto get(@PathVariable long loanApplicationId) throws ResourceNotFoundException {
        LoanApplication loanApplication = this.getLoanApplication(loanApplicationId);
        String groupTypeOfProfile = Group.class.getAnnotation(DiscriminatorValue.class).value();

        if(!loanApplication.getProfile().getType().equals(groupTypeOfProfile)) {
            throw new RuntimeException(String.format("Loan application with (ID=%d) not for group loan", loanApplicationId));
        }
        return this.loanWorker.getConsolidatedLoansByLoanApplication(loanApplication);
    }

    @GetMapping(value = "/by-profile/{profileId}")
    public Page<LoanDto> getByProfile(Pageable pageable, @PathVariable(value = "profileId") long profileId) {
        Profile profile = this.profileService.findOne(profileId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Profile is not found (ID=%d).", profileId)));
        String groupTypeOfProfile = Group.class.getAnnotation(DiscriminatorValue.class).value();

        if(!profile.getType().equals(groupTypeOfProfile)) {
            throw new RuntimeException(String.format("Profile with (ID=%d) is not group profile", profile.getId()));
        }
        return this.loanWorker.getByProfile(pageable, profile);
    }

    private LoanApplication getLoanApplication(Long loanApplicationId) throws ResourceNotFoundException {
        return this.loanApplicationService.findOne(loanApplicationId)
                .orElseThrow(()-> new ResourceNotFoundException(String.format("Loan application is not found (ID=%d) for group loan.", loanApplicationId)));
    }
}
