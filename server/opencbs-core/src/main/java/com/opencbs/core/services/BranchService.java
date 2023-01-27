package com.opencbs.core.services;

import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.customfields.BranchCustomFieldValue;
import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.repositories.BranchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


@Service
public class BranchService {

    private final BranchRepository branchRepository;

    @Autowired
    public BranchService(BranchRepository branchRepository) {
        this.branchRepository = branchRepository;
    }

    @Transactional
    public Branch create(Branch branch) {
        this.updateBranchCustomFields(branch);
        branch.setId(null);
        return this.branchRepository.save(branch);
    }

    @Transactional
    public Branch update(Branch branch) {
        this.updateBranchCustomFields(branch);
        return this.branchRepository.save(branch);
    }

    public Optional<Branch> findByName(String name) {
        return this.branchRepository.findByName(name);
    }

    public Optional<Branch> findOne(Long id) {
        return Optional.of(this.branchRepository.findOne(id));
    }

    public Page<Branch> findAll(Pageable pageable) {
        return this.branchRepository.findAll(pageable);
    }

    public Page<Branch> findByNameContaining(Pageable pageable, String search) {
        if (search == null) search = "";
        return this.branchRepository.getBySearchPattern(pageable, search);
    }

    public List<Branch> findAll() {
        return this.branchRepository.findAll();
    }

    private void updateBranchCustomFields(Branch branch) {
        this.getBranchCustomFields(branch)
                .forEach(x -> {
                    x.setCreatedBy(UserHelper.getCurrentUser());
                    x.setCreatedAt(DateHelper.getLocalDateTimeNow());
                    x.setVerifiedBy(UserHelper.getCurrentUser());
                    x.setVerifiedAt(DateHelper.getLocalDateTimeNow());
                    x.setStatus(EntityStatus.LIVE);
                });
    }

    private List<BranchCustomFieldValue> getBranchCustomFields(Branch branch) {
        return branch.getCustomFieldValues();
    }
}
