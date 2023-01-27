package com.opencbs.termdeposite.services.impl;

import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.termdeposite.domain.TermDeposit;
import com.opencbs.termdeposite.domain.enums.TermDepositStatus;
import com.opencbs.termdeposite.dto.TermDepositSimplified;
import com.opencbs.termdeposite.repositories.TermDepositRepository;
import com.opencbs.termdeposite.services.TermDepositService;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Service
public class TermDepositServiceImpl implements TermDepositService {

    private final TermDepositRepository termDepositRepository;

    @Autowired
    public TermDepositServiceImpl(
            @NonNull TermDepositRepository termDepositRepository) {
        this.termDepositRepository = termDepositRepository;
    }

    @Override
    public TermDeposit save(TermDeposit termDeposit) {
        return termDepositRepository.save(termDeposit);
    }

    @Override
    @Transactional
    public Optional<TermDeposit> getOne(@NonNull Long id) {
        return Optional.of(termDepositRepository.findOne(id));
    }

    @Override
    public Page<TermDeposit> findAllByProfile(Profile profile, Pageable pageable) {
        return termDepositRepository.findByProfile(pageable, profile);
    }

    @Override
    public Page<TermDepositSimplified> getAllWithSearch(String searchString, Pageable pageable) {
        return termDepositRepository.getAllWithSearch(searchString, pageable);
    }

    @Override
    public List<Long> getIdsActiveTermDeposit(Branch branch) {
        return this.termDepositRepository.findIdsWhenTermDepositHasStatus(TermDepositStatus.OPEN, branch);
    }

    @Override
    public LocalDate getExpiredDate(@NonNull LocalDateTime openDate, @NonNull BigDecimal termAgreement) {
        return openDate.toLocalDate().plusMonths(termAgreement.longValue()).plusDays(-1);
    }

    @Override
    public List<TermDeposit> getByProfile(Long profileId) {
        return this.termDepositRepository.findAllByProfileId(profileId);
    }
}
