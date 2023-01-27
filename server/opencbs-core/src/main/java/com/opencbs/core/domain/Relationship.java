package com.opencbs.core.domain;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Data
@Table(name = "relationships")
public class Relationship extends BaseEntity {
    @Column(name = "name", nullable = false)
    private String name;
}
