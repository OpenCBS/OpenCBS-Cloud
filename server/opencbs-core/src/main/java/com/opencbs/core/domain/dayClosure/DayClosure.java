package com.opencbs.core.domain.dayClosure;

import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.domain.Branch;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "day_closures")
@Data
public class DayClosure extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "branch_id", nullable = false)
    private Branch branch;

    @Column(name = "day", nullable = false)
    private LocalDate day;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "failed")
    private boolean failed;

    @Column(name = "error_message")
    private String errorMessage;

    @Column(name = "main_process")
    private boolean mainProcess;
}