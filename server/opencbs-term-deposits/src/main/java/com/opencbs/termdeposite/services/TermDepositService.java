package com.opencbs.termdeposite.services;

import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.termdeposite.domain.TermDeposit;
import com.opencbs.termdeposite.dto.TermDepositSimplified;
import lombok.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TermDepositService {

    TermDeposit save(@NonNull TermDeposit termDeposit);

    Optional<TermDeposit> getOne(@NonNull Long id);

    Page<TermDeposit> findAllByProfile(@NonNull Profile profile, @NonNull Pageable pageable);

    Page<TermDepositSimplified> getAllWithSearch(String searchString, @NonNull Pageable pageable);

    List<Long> getIdsActiveTermDeposit(Branch branch);

    LocalDate getExpiredDate(@NonNull LocalDateTime openDate, @NonNull BigDecimal termAgreement);

    List<TermDeposit> getByProfile(Long profileId);
}
