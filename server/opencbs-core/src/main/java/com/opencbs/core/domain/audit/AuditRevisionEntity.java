package com.opencbs.core.domain.audit;

import com.opencbs.core.listeners.AuditRevisionListener;
import lombok.Data;
import org.hibernate.envers.RevisionEntity;
import org.hibernate.envers.RevisionNumber;
import org.hibernate.envers.RevisionTimestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;


@Data
@Entity
@RevisionEntity(AuditRevisionListener.class)
@Table(name = "revinfo", schema = "audit")
public class AuditRevisionEntity {

    @Id
    @RevisionNumber
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rev")
    private int id;

    @RevisionTimestamp
    @Column(name = "revtstmp")
    private long timestamp;

    @Column(name = "username", nullable = false)
    private String username;
}