package com.opencbs.core.request.repository;

import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.ModuleType;
import com.opencbs.core.repositories.Repository;
import com.opencbs.core.request.domain.Request;
import com.opencbs.core.request.domain.RequestType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface RequestRepository extends Repository<Request> {

    Page<Request> findAllByTypeInAndDeletedFalseAndBranchOrCreatedByAndDeletedFalse(List<RequestType> types, Branch branch, User user, Pageable pageable);

    Optional<Request> findByIdAndBranch(Long id, Branch branch);

    Optional<Request> findByTypeAndEntityIdAndDeletedFalse(RequestType requestType, Long entityId);

    Optional<Request> findFirstByDeletedFalse();

    List<Request> findAllByModuleTypeAndEntityIdAndDeletedFalse(ModuleType moduleType, Long entityId);

    List<Request> findAllByIdIsIn(List<Long> ids);
}
