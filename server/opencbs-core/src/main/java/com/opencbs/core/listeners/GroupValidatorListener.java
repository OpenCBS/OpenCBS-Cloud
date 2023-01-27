package com.opencbs.core.listeners;

import com.opencbs.core.domain.profiles.Group;
import com.opencbs.core.domain.profiles.GroupMember;

public interface GroupValidatorListener {
    void onLeavingGroupValidation(Group group,  GroupMember member);
}
