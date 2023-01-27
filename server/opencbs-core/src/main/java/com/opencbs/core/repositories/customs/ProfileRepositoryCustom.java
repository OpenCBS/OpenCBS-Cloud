package com.opencbs.core.repositories.customs;

import com.opencbs.core.domain.enums.ProfileType;
import com.opencbs.core.domain.profiles.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProfileRepositoryCustom {

    Page<Profile> search(String query, Pageable pageable);

    Page<Profile> findLiveAndPending(Pageable pageable);

    Page<Profile> searchLiveAndPending(String query, Pageable pageable);

    Page<Profile> searchForCompany(ProfileType profileType, String searchString, List<Long> profileIds, Pageable pageable);

    Page<Profile> findLiveAndPendingThatHasLiveFields(Pageable pageable);

    Page<Profile> searchLiveAndPendingThatHasLiveFields(String query, Pageable pageable);

    Page<Profile> searchAvailableGuarantors(String query, List<Long> ids, Pageable pageable);

}
