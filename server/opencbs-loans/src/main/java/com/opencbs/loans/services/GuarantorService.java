package com.opencbs.loans.services;

import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.repositories.ProfileRepository;
import com.opencbs.loans.domain.Guarantor;
import com.opencbs.loans.domain.LoanApplication;
import com.opencbs.loans.repositories.GuarantorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GuarantorService {
    private final GuarantorRepository guarantorRepository;
    private final ProfileRepository profileRepository;

    @Autowired
    public GuarantorService(GuarantorRepository guarantorRepository, ProfileRepository profileRepository) {
        this.guarantorRepository = guarantorRepository;
        this.profileRepository = profileRepository;
    }

    public List<Guarantor> findAll(LoanApplication loanApplication) {
        return this.guarantorRepository.findGuarantorByLoanApplication(loanApplication);
    }

    public Optional<Guarantor> findOne(long id) {
        return Optional.ofNullable(guarantorRepository.findOne(id));
    }

    @Transactional
    public Guarantor create(Guarantor guarantor) {
        guarantor.setId(0L);
        return this.guarantorRepository.save(guarantor);
    }

    @Transactional
    public Guarantor update(Guarantor guarantor) {
        return this.guarantorRepository.save(guarantor);
    }

    public Page<Profile> findAvailableProfiles(String query, LoanApplication loanApplication, Pageable pageable) {
        List<Long> list = loanApplication.getGuarantors()
                .stream()
                .filter(x -> x.getClosedAt() == null)
                .map(x -> x.getProfile().getId())
                .collect(Collectors.toList());
        list.add(loanApplication.getProfile().getId());
        return this.profileRepository.searchAvailableGuarantors(query, list, pageable);
    }
}