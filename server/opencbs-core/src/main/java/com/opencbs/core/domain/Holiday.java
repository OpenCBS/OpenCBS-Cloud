package com.opencbs.core.domain;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "holidays")
public class Holiday extends BaseEntity {
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "is_annual", nullable = false)
    private boolean isAnnual;
}
