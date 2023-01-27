package com.opencbs.core.repositories;

import com.opencbs.core.domain.ProfileAccounts;

import java.util.Optional;

public interface ProfileAccountsRepository extends Repository<ProfileAccounts> {

    Optional<ProfileAccounts> findByProfileId(Long profileId);

}
