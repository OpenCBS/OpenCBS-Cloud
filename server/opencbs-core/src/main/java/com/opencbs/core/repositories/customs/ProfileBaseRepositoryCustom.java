package com.opencbs.core.repositories.customs;

import com.opencbs.core.domain.profiles.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProfileBaseRepositoryCustom<T extends Profile> {
    Page<T> findLiveAndPendingThatHasLiveFields(Pageable pageable);
    Page<T> searchLiveAndPendingThatHasLiveFields(String searchString, Pageable pageable);
}
