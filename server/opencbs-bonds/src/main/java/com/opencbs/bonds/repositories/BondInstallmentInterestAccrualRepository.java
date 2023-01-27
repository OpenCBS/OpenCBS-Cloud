package com.opencbs.bonds.repositories;

import com.opencbs.bonds.domain.BondInstallmentInterestAccrual;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BondInstallmentInterestAccrualRepository extends JpaRepository<BondInstallmentInterestAccrual, Long> {

    List<BondInstallmentInterestAccrual> findByBondId(Long bondId);
}
