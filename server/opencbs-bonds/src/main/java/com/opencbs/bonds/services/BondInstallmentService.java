package com.opencbs.bonds.services;

import com.opencbs.bonds.domain.BondInstallment;
import com.opencbs.bonds.repositories.BondInstallmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BondInstallmentService {

    private final BondInstallmentRepository bondInstallmentRepository;

    @Autowired
    public BondInstallmentService(
            BondInstallmentRepository bondInstallmentRepository) {
        this.bondInstallmentRepository = bondInstallmentRepository;
    }

    public void save(BondInstallment bondInstallment){
        this.bondInstallmentRepository.save(bondInstallment);
    }

    public List<BondInstallment> findAllByBondId(Long bondId) {
        return this.bondInstallmentRepository.findAllByBondIdAndDeletedFalse(bondId);
    }
}
