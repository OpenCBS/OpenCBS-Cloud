package com.opencbs.core.workers;

import com.opencbs.core.domain.User;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.dto.SimplifiedProfileAccount;
import com.opencbs.core.services.ProfileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Slf4j
@Service
public class DefaultProfileWorker implements ProfileWorker {

    private final ProfileService profileService;

    @Autowired
    public DefaultProfileWorker(ProfileService profileService) {
        this.profileService = profileService;
    }

    public Set<Profile> getRelatedProfiles(Profile profile, Pageable pageable, User user) {
        Set<Profile> profiles = new HashSet<>();
        if (pageable.getPageNumber() == 0) {
            profiles.add(profile);
        }
        profiles.addAll(profileService.search("", pageable, user).getContent());

        return profiles;
    }

    @Override
    public Page<SimplifiedProfileAccount> getAllWithCurrentAccount(String searchString, Pageable pageable, User user) {
        return profileService.getAllWithCurrentAccount(searchString, pageable, user);
    }
}
