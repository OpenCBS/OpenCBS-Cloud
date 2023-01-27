package com.opencbs.core.domain.profiles;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.CreationInfoEntity;
import com.opencbs.core.domain.NamedEntity;
import com.opencbs.core.domain.enums.EntityStatus;
import lombok.Data;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;

import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@Audited
@Table(name = "profiles")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "[type]", discriminatorType = DiscriminatorType.STRING)
public class Profile extends CreationInfoEntity implements NamedEntity {

    @Column(name = "[type]", nullable = false, insertable = false, updatable = false)
    private String type;

    @Column(name = "[name]", nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private EntityStatus status;

    @Column(name = "version")
    private Integer version;

    @NotAudited
    @ManyToOne
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @NotAudited
    @ManyToMany
    @JoinTable(name = "profiles_accounts",
            joinColumns = @JoinColumn(name = "profile_id"),
            inverseJoinColumns = @JoinColumn(name = "account_id"))
    private Set<Account> currentAccounts = new HashSet<>();

    public String getNameFromCustomFields() {
        return null;
    }
}
