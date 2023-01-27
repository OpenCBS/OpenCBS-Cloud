package com.opencbs.core.domain;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

@MappedSuperclass
@Data
public abstract class NamedBaseEntity extends BaseEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @Override
    public String toString() {
        return name;
    }
}
