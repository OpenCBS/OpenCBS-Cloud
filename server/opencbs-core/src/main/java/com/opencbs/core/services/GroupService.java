package com.opencbs.core.services;

import com.opencbs.core.accounting.services.AccountService;
import com.opencbs.core.domain.customfields.GroupCustomFieldValue;
import com.opencbs.core.domain.enums.ProfileType;
import com.opencbs.core.domain.profiles.Group;
import com.opencbs.core.domain.profiles.GroupMember;
import com.opencbs.core.domain.profiles.Person;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.listeners.GroupMemberListener;
import com.opencbs.core.repositories.ProfileBaseRepository;
import com.opencbs.core.repositories.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
public class GroupService extends ProfileBaseService<Group, GroupCustomFieldValue> {

    private final PersonService personService;
    private final ProfileBaseRepository<Group> profileBaseRepository;
    private final GroupMemberService groupMemberService;
    private final ProfileRepository profileRepository;
    private final List<GroupMemberListener> groupMemberListenerList;


    @Autowired
    public GroupService(
            GlobalSettingsService globalSettingsService,
            AccountService accountService,
            CurrencyService currencyService,
            PersonService personService,
            ProfileBaseRepository<Group> profileBaseRepository,
            GroupMemberService groupMemberService,
            ProfileRepository profileRepository,
            CurrentAccountGenerator currentAccountGenerator,
            List<GroupMemberListener> groupMemberListenerList) {
        super(profileBaseRepository,
                globalSettingsService,
                accountService,
                currencyService,
                currentAccountGenerator);
        this.personService = personService;
        this.profileBaseRepository = profileBaseRepository;
        this.groupMemberService = groupMemberService;
        this.profileRepository = profileRepository;
        this.groupMemberListenerList = groupMemberListenerList;
    }

    @Override
    List<GroupCustomFieldValue> getProfileCustomFieldValues(Group profile) {
        return profile.getCustomFieldValues();
    }

    @Override
    void setProfileCustomFieldValues(Group profile, List<GroupCustomFieldValue> values) {
        profile.setCustomFieldValues(values);
    }

    public Group addMember(Group group, Long memberId) {
        Person person = this.personService.findOne(memberId).get();
        GroupMember groupMember = new GroupMember();
        groupMember.setMember(person);
        groupMember.setGroup(group);
        groupMember.setJoinDate(DateHelper.getLocalDateTimeNow());
        groupMember.setLeftDate(null);
        this.groupMemberService.save(groupMember);
        group.getGroupMembers().add(groupMember);
        return group;
    }

    @Transactional
    public Group removeMember(Group group, Long memberId) {
        GroupMember member = group.getGroupMembers()
                .stream()
                .filter(x -> x.getMember().getId().equals(memberId) && x.getLeftDate() == null)
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Member not found (ID=%d).", memberId)));

        member.setLeftDate(DateHelper.getLocalDateTimeNow());

        this.groupMemberListenerList.forEach(groupMemberListener -> groupMemberListener.onRemoveMember(group, memberId));

        return this.profileBaseRepository.save(group);
    }

    public Group getGroup(long id) throws ResourceNotFoundException {
        return this.findOne(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Group not found (ID=%d).", id)));
    }

    public Page<Profile> getAllPeopleWithoutDuplicate(Group group, String search, Pageable pageable) {
        List<Long> profileIds = new ArrayList<>();
        group.getGroupMembers()
                .stream()
                .filter((x) -> x.getLeftDate() == null)
                .forEach((x) -> profileIds.add(x.getMember().getId()));
        return this.profileRepository.searchForCompany(ProfileType.PERSON, search, profileIds, pageable);
    }
}
