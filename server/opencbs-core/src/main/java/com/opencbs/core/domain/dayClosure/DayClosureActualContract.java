package com.opencbs.core.domain.dayClosure;

import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.domain.enums.ProcessType;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Immutable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)

@Entity
@Immutable
@Table(name = "day_closure_contracts")
public class DayClosureActualContract extends BaseEntity {

    @Column(name = "contract_id")
    private Long contractId;

    @Enumerated(EnumType.STRING)
    @Column(name = "process_type")
    private ProcessType processType;

    @Column(name = "actual_date")
    private LocalDate actualDate;
}