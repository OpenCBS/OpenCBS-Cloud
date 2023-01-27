package com.opencbs.core.services;

import com.opencbs.core.audit.dto.AuditReportDto;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.UserSession;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.repositories.UserSessionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Optional;

@Service
public class UserSessionService {

    private final UserSessionRepository userSessionRepository;


    public UserSessionService(UserSessionRepository userSessionRepository) {
        this.userSessionRepository = userSessionRepository;
    }

    public Optional<UserSession> findByUser(User user) {
        return userSessionRepository.findFirstByUserNameOrderByIpDesc(user.getUsername());
    }

    public void save(UserSession userSession) {
        userSessionRepository.save(userSession);
    }

    public void updateLastEventTime(User user) {
        UserSession userSession = userSessionRepository.findFirstByUserNameOrderByIpDesc(user.getUsername()).get();
        userSession.setLastEntryTime(DateHelper.getLocalDateTimeNow());
        userSessionRepository.saveAndFlush(userSession);
    }

    public Page<UserSession> getAll(Pageable pageable) {
        return userSessionRepository.findAll(pageable);
    }

    public void setSuccessLoginStatus(User user, String ip) {
        UserSession userSession = userSessionRepository.findFirstByUserNameAndIpOrderByLastEntryTimeDesc(user.getUsername(), ip);
        userSession.setLoginStatusType(UserSession.LoginStatusType.SUCCESS);
        userSessionRepository.save(userSession);
    }

    public Page<UserSession> getAllByDatesAndUser(AuditReportDto filter, Pageable pageable) {
        return userSessionRepository.findByLastEntryTimeBetweenOrderByLastEntryTimeDesc(LocalDateTime.of(filter.getFromDate(), LocalTime.MIN), LocalDateTime.of(filter.getToDate(), LocalTime.MAX), pageable);
    }
}

