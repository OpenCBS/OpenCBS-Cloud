package com.opencbs.core.domain.taskmanager;

import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.domain.User;
import lombok.Data;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "task_events")
@Data
public class TaskEvent extends BaseEntity {
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "notify_at", nullable = false)
    private LocalDateTime notifyAt;

    @OneToMany(mappedBy = "taskEvent", cascade = CascadeType.PERSIST)
    private List<TaskEventParticipant> participants;

    @Column(name = "created_at", nullable = false)
    @CreatedDate
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    @CreatedBy
    private User createdBy;

    @Column(name = "all_day", nullable = false)
    private boolean allDay;
}
