package com.opencbs.core.repositories;

import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.repositories.customs.ProfileRepositoryCustom;
import org.springframework.data.repository.history.RevisionRepository;

import java.util.Collection;
import java.util.List;

public interface ProfileRepository extends RevisionRepository<Profile, Long, Integer>, Repository<Profile>, ProfileRepositoryCustom {

    List<Profile> findByIdIn(Collection<Long> ids);
    Profile findByName(String name);
}
