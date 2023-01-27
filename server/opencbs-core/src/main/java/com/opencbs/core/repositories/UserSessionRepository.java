package com.opencbs.core.repositories;

import com.opencbs.core.domain.UserSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Optional;

public interface UserSessionRepository extends Repository<UserSession> {

    Optional<UserSession> findFirstByUserNameOrderByIpDesc(String username);
    UserSession findFirstByUserNameAndIpOrderByLastEntryTimeDesc(String username, String ip);

    Page<UserSession> findByLastEntryTimeBetweenOrderByLastEntryTimeDesc(LocalDateTime fromDate, LocalDateTime toDate, Pageable pageable);
}
