package com.opencbs.core.workers;

import com.opencbs.core.domain.User;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.dto.SimplifiedProfileAccount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Collection;

public interface ProfileWorker {

    Collection<Profile> getRelatedProfiles(Profile profile, Pageable pageable, User user);
    Page<SimplifiedProfileAccount> getAllWithCurrentAccount(String searchString, Pageable pageable, User user);
}
