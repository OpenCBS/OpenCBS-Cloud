package com.opencbs.core.repositories;

import com.opencbs.core.domain.OtherFee;

import java.util.Optional;

public interface OtherFeeRepository extends Repository<OtherFee> {

    Optional<OtherFee> findByName(String name);
}
