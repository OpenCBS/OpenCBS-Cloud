package com.opencbs.core.listeners;

import com.opencbs.core.domain.profiles.Group;

public interface GroupMemberListener {
    void onRemoveMember(Group group, Long memberId);
}
