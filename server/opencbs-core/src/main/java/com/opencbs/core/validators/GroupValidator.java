package com.opencbs.core.validators;

import com.opencbs.core.annotations.Validator;
import com.opencbs.core.domain.enums.ProfileType;
import com.opencbs.core.domain.profiles.Group;
import com.opencbs.core.domain.profiles.GroupMember;
import com.opencbs.core.exceptions.ApiException;
import com.opencbs.core.listeners.GroupValidatorListener;
import com.opencbs.core.services.CompanyService;
import com.opencbs.core.services.GroupService;
import com.opencbs.core.services.PersonService;
import io.jsonwebtoken.lang.Assert;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

import java.util.List;

@Validator
@RequiredArgsConstructor
public class GroupValidator {

    private final GroupService groupService;
    private final CompanyService companyService;
    private final PersonService personService;
    private final List<GroupValidatorListener> groupValidatorListenerList;


    public void validateMembers(Long memberId, Long groupId) {
        if(this.companyService.findOne(memberId).isPresent()){
            Assert.isTrue(this.companyService.findOne(memberId).get().getType().equals(ProfileType.PERSON.toString()), String.format("Profile with (ID = %d) is company. You can only add a person", memberId));
        }

        if(this.groupService.findOne(memberId).isPresent()) {
            Assert.isTrue(this.groupService.findOne(memberId).get().getType().equals(ProfileType.PERSON.toString()), String.format("Profile with (ID = %d) is group. You can only add a person", memberId));
        }

        Assert.isTrue(personService.exists(memberId), String.format("Person doesn't exist (ID = %d)", memberId));
        Assert.isTrue(
                groupService.findOne(groupId).get().getGroupMembers()
                        .stream()
                        .noneMatch(x -> x.getMember().getId()
                                .equals(memberId) && x.getLeftDate() == null),
                String.format("The person (ID = %d) is already in the group.", memberId)
        );
    }

    public void validateMemberForLeaveGroup(Long memberId, Group group) {
        Assert.isTrue(this.personService.exists(memberId), String.format("This group doesn't have member with (ID = %d)", memberId));

        GroupMember member = group.getGroupMembers()
                .stream()
                .filter(x -> x.getMember().getId().equals(memberId) && x.getLeftDate() == null)
                .findFirst()
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "404",
                        String.format("Person with (ID = %d) not found in this group", memberId)));

        this.groupValidatorListenerList.forEach(groupValidatorListener -> groupValidatorListener.onLeavingGroupValidation(group, member));

    }

}
