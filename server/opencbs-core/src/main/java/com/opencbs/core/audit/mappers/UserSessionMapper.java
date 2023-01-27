package com.opencbs.core.audit.mappers;

import com.opencbs.core.annotations.Mapper;
import com.opencbs.core.audit.dto.AuditUserSessionsDto;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.UserSession;
import com.opencbs.core.services.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;

import java.util.Optional;

@Mapper
@RequiredArgsConstructor
public class UserSessionMapper {

    private final UserService userService;

    public AuditUserSessionsDto mapToAuditDto(UserSession userSession) {
        ModelMapper mapper = new ModelMapper();
        AuditUserSessionsDto dto = mapper.map(userSession, AuditUserSessionsDto.class);

        Optional<User> optionalUser = userService.findByUsername(userSession.getUserName());
        if (optionalUser.isPresent()) {
           dto.setUsername(optionalUser.get().getFullName());
        }
        return dto;
    }
}