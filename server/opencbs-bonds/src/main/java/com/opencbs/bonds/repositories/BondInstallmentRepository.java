package com.opencbs.bonds.repositories;

import com.opencbs.bonds.domain.BondInstallment;
import com.opencbs.core.repositories.Repository;

import java.util.List;

public interface BondInstallmentRepository extends Repository<BondInstallment> {
    List<BondInstallment> findAllByBondIdAndDeletedFalse(Long bondId);
}
