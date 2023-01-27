package com.opencbs.core.domain.trees;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.opencbs.core.domain.BaseEntity;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

@Data
@MappedSuperclass
public abstract class TreeEntity<T extends TreeEntity> extends BaseEntity {

    @Column(name = "name", nullable = false, unique = true)
    protected String name;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    protected T parent;
}
