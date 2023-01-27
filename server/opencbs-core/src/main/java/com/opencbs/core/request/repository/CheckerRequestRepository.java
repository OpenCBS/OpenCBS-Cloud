package com.opencbs.core.request.repository;

import com.opencbs.core.repositories.Repository;
import com.opencbs.core.request.domain.CheckerRequest;
import com.opencbs.core.request.domain.RequestType;

public interface CheckerRequestRepository extends Repository<CheckerRequest> {

    CheckerRequest findByRequestType(RequestType requestType);

}
