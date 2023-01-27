package com.opencbs.borrowings.repositories;

import com.opencbs.borrowings.domain.Borrowing;
import com.opencbs.borrowings.domain.enums.BorrowingStatus;
import com.opencbs.borrowings.repositories.custom.BorrowingRepositoryCustom;
import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.repositories.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BorrowingRepository extends Repository<Borrowing>, BorrowingRepositoryCustom {

    Page<Borrowing> findByProfile(Pageable pageable, Profile profile);

    @Query("select b.id as id from Borrowing b where b.status = ?1 and b.branch = ?2")
    List<Long> findIdsWhenBorrowingHasStatus(BorrowingStatus borrowingStatus, Branch branch);

    Optional<Borrowing> findById(Long id);
}
