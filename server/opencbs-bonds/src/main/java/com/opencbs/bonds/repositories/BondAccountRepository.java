package com.opencbs.bonds.repositories;

import com.opencbs.bonds.domain.Bond;
import com.opencbs.bonds.domain.BondAccount;
import com.opencbs.core.repositories.Repository;

import java.util.List;

public interface BondAccountRepository extends Repository<BondAccount> {
    List<BondAccount> getAllByBond(Bond bond);

    List<BondAccount> getAllByBondId(Long bondId);
}
