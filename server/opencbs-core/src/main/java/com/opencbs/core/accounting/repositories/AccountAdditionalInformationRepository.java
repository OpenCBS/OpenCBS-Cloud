package com.opencbs.core.accounting.repositories;

import com.opencbs.core.accounting.domain.AccountAdditionalInformation;
import com.opencbs.core.repositories.Repository;

import java.util.List;

public interface AccountAdditionalInformationRepository extends Repository<AccountAdditionalInformation> {

    List<AccountAdditionalInformation> getAllByIdIn(List<Long> ids);
}