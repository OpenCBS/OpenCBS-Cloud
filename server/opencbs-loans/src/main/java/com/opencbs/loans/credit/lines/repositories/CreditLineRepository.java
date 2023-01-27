package com.opencbs.loans.credit.lines.repositories;

import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.repositories.Repository;
import com.opencbs.loans.credit.lines.domain.CreditLine;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface CreditLineRepository extends Repository<CreditLine> {

    Page<CreditLine> findAllByProfile(Pageable pageable, Profile profile);
    Optional<CreditLine> findById(Long id);
    Optional<CreditLine> findByName(String name);
    List<CreditLine> findAllByProfile(Profile profile);
}
