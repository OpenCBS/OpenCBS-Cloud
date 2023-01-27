package com.opencbs.loans.credit.lines.services;

import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.exceptions.ResourceNotFoundException;
import com.opencbs.loans.credit.lines.domain.CreditLine;
import com.opencbs.loans.credit.lines.repositories.CreditLineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CreditLineService {

    private final CreditLineRepository creditLineRepository;

    public Page<CreditLine> getAllByProfile(Pageable pageable, Profile profile) {
        return this.creditLineRepository.findAllByProfile(pageable, profile);
    }

    public List<CreditLine> findAllByProfile(Profile profile) {
        return this.creditLineRepository.findAllByProfile(profile);
    }

    public CreditLine getCreditLineById(Long id) {
        return this.getById(id).orElseThrow(() -> new ResourceNotFoundException(String.format("Credit Line not found (ID=%d).", id)));
    }

    private Optional<CreditLine> getById(Long id) {
        return this.creditLineRepository.findById(id);
    }

    public Optional<CreditLine> getByName(String name) {
        return this.creditLineRepository.findByName(name);
    }

    @Transactional
    public CreditLine create(CreditLine creditLine) {
        creditLine.setId(null);
        return this.creditLineRepository.save(creditLine);
    }

    @Transactional
    public CreditLine update(CreditLine creditLine) {
        return this.creditLineRepository.save(creditLine);
    }
}
