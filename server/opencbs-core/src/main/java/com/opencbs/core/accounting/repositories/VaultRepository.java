package com.opencbs.core.accounting.repositories;

import com.opencbs.core.domain.till.Vault;
import com.opencbs.core.repositories.Repository;

public interface VaultRepository extends Repository<Vault> {
    Vault findByName (String name);
}