package com.opencbs.core.repositories;

import com.opencbs.core.domain.EntryFee;

import java.util.List;
import java.util.Optional;

public interface EntryFeeRepository extends Repository<EntryFee> {
    Optional <EntryFee> findByName(String name);
    List<EntryFee> findByAccount_Currency_Id(Long currencyId);
}
