package com.opencbs.core.repositories;

import com.opencbs.core.domain.Role;
import org.springframework.data.repository.history.RevisionRepository;

import java.util.Optional;

public interface RoleRepository extends RevisionRepository<Role, Long, Integer>, Repository<Role> {
    Optional<Role> findByName(String roleName);

}
