package com.opencbs.core.domain.dayClosure;

import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.enums.ProcessType;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)

@Entity
@Table(name = "day_closure_contracts")
public class DayClosureContract extends BaseEntity {

    @Column(name = "contract_id", nullable = false)
    private Long contractId;

    @Enumerated(EnumType.STRING)
    @Column(name = "process_type", nullable = false)
    private ProcessType processType;

    @Column(name = "actual_date", nullable = false)
    private LocalDate actualDate;

    @Column(name = "error_message")
    private String errorMessage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;
}