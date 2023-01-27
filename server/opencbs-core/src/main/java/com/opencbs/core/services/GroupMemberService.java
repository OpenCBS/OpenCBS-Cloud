package com.opencbs.core.services;

import com.opencbs.core.domain.profiles.GroupMember;
import com.opencbs.core.repositories.GroupsMembersBaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GroupMemberService {

    private final GroupsMembersBaseRepository groupsMembersBaseRepository;

    @Autowired
    public GroupMemberService(GroupsMembersBaseRepository groupsMembersBaseRepository) {
        this.groupsMembersBaseRepository = groupsMembersBaseRepository;
    }

    public GroupMember save(GroupMember groupMember) {
        return this.groupsMembersBaseRepository.save(groupMember);
    }

}