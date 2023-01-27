package com.opencbs.bonds.repositories;

import com.opencbs.bonds.domain.BondProduct;
import com.opencbs.bonds.domain.BondProductAccount;
import com.opencbs.core.repositories.Repository;

import java.util.List;

public interface BondProductAccountRepository extends Repository<BondProductAccount> {
    List<BondProductAccount> getAllByBondProduct(BondProduct bondProduct);
}
