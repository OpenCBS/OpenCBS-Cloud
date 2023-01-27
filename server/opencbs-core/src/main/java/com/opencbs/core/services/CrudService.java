package com.opencbs.core.services;

import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.request.domain.RequestType;

import java.util.List;
import java.util.Optional;

public interface CrudService<E extends BaseEntity> {

    E create(E entity);

    List<E> findAll();

    Optional<E> getOne(Long id);

    E update(E entity);

    Boolean isRequestSupported(RequestType requestType);
}
