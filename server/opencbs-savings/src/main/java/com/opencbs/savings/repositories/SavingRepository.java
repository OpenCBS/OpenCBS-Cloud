package com.opencbs.savings.repositories;

import com.opencbs.core.domain.Branch;
import com.opencbs.core.repositories.Repository;
import com.opencbs.savings.domain.Saving;
import com.opencbs.savings.domain.enums.SavingStatus;
import com.opencbs.savings.repositories.customs.SavingRepositoryCustom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SavingRepository extends Repository<Saving>, SavingRepositoryCustom {

    Page<Saving> findAllByProfileId(Pageable pageable, Long profileId);

    List<Saving> findAllByProfileId(Long profileId);

    @Query("select s.id as id from Saving s where s.status = ?1 and s.branch = ?2")
    List<Long> findIdsWhenSavingHasStatus(SavingStatus savingStatus, Branch branch);
}