package com.opencbs.core.domain.profiles;

import com.opencbs.core.domain.Branch;
import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.EntityStatus;
import lombok.Data;
import org.hibernate.annotations.Immutable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@Entity
@Immutable
@Table(name = "searchable_profiles")
public class SearchableProfile extends BaseEntity {

    @Column(name = "[type]", nullable = false, insertable = false, updatable = false)
    private String type;

    @Column(name = "[name]", nullable = false)
    private String name;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private EntityStatus status;

    @Column(name = "searchable_content", nullable = false)
    private String searchableContent;

    @Column(name = "custom_field_value_statuses")
    private String customFieldValueStatuses;

    @ManyToMany
    @JoinTable(name = "profiles_accounts",
            joinColumns = @JoinColumn(name = "profile_id"),
            inverseJoinColumns = @JoinColumn(name = "account_id"))
    private Set<Account> currentAccounts;
}
