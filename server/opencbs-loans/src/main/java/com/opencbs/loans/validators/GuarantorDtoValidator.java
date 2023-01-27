package com.opencbs.loans.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.services.ProfileService;
import com.opencbs.core.services.RelationshipService;
import com.opencbs.loans.dto.GuarantorDto;
import org.springframework.util.Assert;

@Validator
public class GuarantorDtoValidator {

    private final ProfileService profileService;

    private final RelationshipService relationshipService;

    public GuarantorDtoValidator(ProfileService profileService,
                                 RelationshipService relationshipService) {
        this.profileService = profileService;
        this.relationshipService = relationshipService;
    }

    public void validate(GuarantorDto guarantorDto) throws Exception {
        Assert.notNull(guarantorDto.getRelationshipId(),"Relationship ID is required.");
        Assert.notNull(guarantorDto.getProfileId(),"Profile ID is required.");

        this.profileService.findOne(guarantorDto.getProfileId()).orElseThrow(() -> new ResourceNotFoundException(
                String.format("Profile not found (ID=%d).", guarantorDto.getProfileId())));

        this.relationshipService.findOne(guarantorDto.getRelationshipId()).orElseThrow(() -> new ResourceNotFoundException(
                String.format("Relationship not found (ID=%d).", guarantorDto.getProfileId())));
    }
}
