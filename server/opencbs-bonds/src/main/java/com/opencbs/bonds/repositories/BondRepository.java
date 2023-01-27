package com.opencbs.bonds.repositories;

import com.opencbs.bonds.domain.Bond;
import com.opencbs.bonds.domain.enums.BondStatus;
import com.opencbs.bonds.repositories.custom.BondRepositoryCustom;
import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.repositories.Repository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BondRepository extends Repository<Bond>, BondRepositoryCustom {

    List<Bond> findAllByProfile(Pageable pageable, Profile profile);

    @Query("select b.id as id from Bond b where b.status = ?1 and b.branch = ?2")
    List<Long> findIdsWhenBondHasStatus(BondStatus bondStatus, Branch branch);

    Optional<Bond> findById(Long id);

}
