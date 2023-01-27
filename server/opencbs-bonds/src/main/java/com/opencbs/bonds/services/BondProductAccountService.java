package com.opencbs.bonds.services;

import com.opencbs.bonds.domain.BondProduct;
import com.opencbs.bonds.domain.BondProductAccount;
import com.opencbs.bonds.repositories.BondProductAccountRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BondProductAccountService {

    private final BondProductAccountRepository bondProductAccountRepository;

    public BondProductAccountService(BondProductAccountRepository bondProductAccountRepository) {
        this.bondProductAccountRepository = bondProductAccountRepository;
    }

    public List<BondProductAccount> getAllBondProductAccounts(BondProduct bondProduct){
        return this.bondProductAccountRepository.getAllByBondProduct(bondProduct);
    }
}
