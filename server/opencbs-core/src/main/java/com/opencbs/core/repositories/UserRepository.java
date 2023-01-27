package com.opencbs.core.repositories;

import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.StatusType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.history.RevisionRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends RevisionRepository<User, Long, Integer>, Repository<User> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmailOrUsername(String email, String username);

    List<User> findAllByIsSystemUserFalse();

    Page<User> findDistinctByIsSystemUserFalseAndRolePermissionsNameIn(Pageable pageable, List<String> strings);

    @Query("SELECT u FROM User u WHERE (lower(concat(u.firstName, ' ', u.lastName)) LIKE lower(concat('%', ?1, '%'))) AND u.isSystemUser = false AND u.statusType IN ?2")
    Page<User> getBySearchPattern(Pageable pageable, String search, List<StatusType> statusTypes);

    @Query("SELECT u FROM User u WHERE (lower(concat(u.firstName, ' ', u.lastName)) LIKE lower(concat('%', ?1, '%'))) AND u.isSystemUser = false AND u.branch = ?2 AND u.statusType IN ?3")
    Page<User> getBySearchPatternAndBranchId(Pageable pageable, String search, Long branchId, List<StatusType> statusTypes);

    Long countByIsSystemUserFalse();
}
