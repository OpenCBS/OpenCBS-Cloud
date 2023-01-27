package com.opencbs.core.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.enums.ProfileType;
import com.opencbs.core.domain.profiles.Company;
import com.opencbs.core.domain.profiles.CompanyMember;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.services.CompanyService;
import com.opencbs.core.services.GroupService;
import com.opencbs.core.services.PersonService;
import io.jsonwebtoken.lang.Assert;

@Validator
public class CompanyValidator {

    private final CompanyService companyService;
    private final GroupService groupService;
    private final PersonService personService;

    public CompanyValidator(CompanyService companyService,
                            GroupService groupService,
                            PersonService personService) {
        this.companyService = companyService;
        this.groupService = groupService;
        this.personService = personService;
    }

    public void validateAddMembers(Long memberId, Company company) {
        if(this.companyService.findOne(memberId).isPresent()){
            Assert.isTrue(this.companyService.findOne(memberId).get().getType().equals(ProfileType.PERSON.toString()), String.format("Profile with (ID = %d) is company. You can add a person only.", memberId));
        }

        if(this.groupService.findOne(memberId).isPresent()) {
            Assert.isTrue(this.groupService.findOne(memberId).get().getType().equals(ProfileType.PERSON.toString()), String.format("Profile with (ID = %d) is group. You can add a person only.", memberId));
        }

        Assert.isTrue(personService.exists(memberId), String.format("Person doesn't exist (ID = %d)", memberId));
        Assert.isTrue(company.getCompanyMembers()
                        .stream()
                        .noneMatch(x -> x.getMember().getId()
                                .equals(memberId) && x.getLeftDate() == null),
                String.format("The person (ID = %d) is already in the group.", memberId)
        );
    }

    public void validateRemoveMembers(Long memberId, Company company) {
        Assert.isTrue(this.personService.exists(memberId), String.format("This company doesn't have member with (ID = %d)", memberId));

        CompanyMember member = company.getCompanyMembers()
                .stream()
                .filter(x -> x.getMember().getId().equals(memberId) && x.getLeftDate() == null)
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Person with (ID = %d) not found in this group", memberId)));
    }

}
