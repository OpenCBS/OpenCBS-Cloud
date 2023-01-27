package com.opencbs.core.domain.profiles;

import com.opencbs.core.domain.BaseEntity;
import lombok.Data;
import org.hibernate.envers.Audited;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Data
@Audited
@Entity
@Table(name = "groups_members")
public class GroupMember extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Person member;

    @Column(name = "join_date", nullable = false)
    private LocalDateTime joinDate;

    @Column(name = "left_date")
    private LocalDateTime leftDate;

}