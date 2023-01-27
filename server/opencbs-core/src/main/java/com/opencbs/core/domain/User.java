package com.opencbs.core.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.opencbs.core.domain.enums.StatusType;
import lombok.Data;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;

import static org.hibernate.envers.RelationTargetAuditMode.NOT_AUDITED;

@Data
@Audited
@Entity
@Table(name = "users")
public class User extends BaseEntity implements UserDetails, NamedEntity {

    public static final String TELLER = "TELLER";
    public static final String HEAD_TELLER = "HEAD_TELLER";

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @NotAudited
    @Column(name = "password_hash", nullable = false)
    @JsonIgnore
    private String passwordHash;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "time_zone_name", nullable = false)
    private String timeZoneName = "Asia/Bishkek";

    @Audited(targetAuditMode = NOT_AUDITED)
    @ManyToOne
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @NotAudited
    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Audited(targetAuditMode = NOT_AUDITED)
    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @Column(name = "email")
    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "id_number")
    private String idNumber;

    @Column(name = "address")
    private String address;

    @Column(name = "position")
    private String position;

    @NotAudited
    @Column(name = "password_expire_date")
    private LocalDate expireDate;

    @NotAudited
    @Column(name = "first_login")
    private Boolean firstLogin;

    @Override
    @JsonIgnore
    public String getPassword() {
        return null;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return true;
    }

    @Column(name = "is_system_user")
    @JsonIgnore
    private Boolean isSystemUser = false;

    public boolean hasPermission(String permission) {
        return getRole()
                .getPermissions()
                .stream()
                .anyMatch(x -> x.getName().equals(permission));
    }

    @NotAudited
    @Column(name = "last_entry_time")
    private LocalDateTime lastEntryTime;

    @Enumerated(EnumType.STRING)
    @Column(name="status", nullable = false)
    private StatusType statusType = StatusType.ACTIVE;

    public String getFullName(){
        return String.format("%s %s", this.firstName, this.lastName);
    }

    @Override
    public String getName() {
        return this.getFullName();
    }
}
