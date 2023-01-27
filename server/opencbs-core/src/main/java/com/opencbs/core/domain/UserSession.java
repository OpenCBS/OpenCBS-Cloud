package com.opencbs.core.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;
import java.time.LocalDateTime;


@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "user_sessions")
public class UserSession extends BaseEntity {

    public enum LoginStatusType {
        FAIL,
        SUCCESS,
    }

    public enum LoginActionType {
        LOGIN,
        LOGOUT,
        FORCE_LOGOUT
    }

    @Column(name = "user_name")
    private String userName;

    @Column(name = "ip")
    private String ip;

    @Column(name = "last_entry_time")
    private LocalDateTime lastEntryTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "login_action_type")
    @Builder.Default
    private LoginActionType loginActionType = LoginActionType.LOGIN;

    @Enumerated(EnumType.STRING)
    @Column(name = "login_status_type")
    @Builder.Default
    private LoginStatusType loginStatusType = LoginStatusType.FAIL;
}
