package com.opencbs.core.repositories;

import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.repositories.customs.ProfileBaseRepositoryCustom;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface ProfileBaseRepository<T extends Profile> extends Repository<T>, ProfileBaseRepositoryCustom<T> {
}
