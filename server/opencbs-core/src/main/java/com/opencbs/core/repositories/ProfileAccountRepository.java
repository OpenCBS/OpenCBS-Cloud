package com.opencbs.core.repositories;

import com.opencbs.core.domain.profiles.ProfileAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfileAccountRepository extends JpaRepository<ProfileAccount, Long> {

    Optional<ProfileAccount> findByProfileIdAndAccount_Currency_Id(Long profileId, Long currencyId);
}
