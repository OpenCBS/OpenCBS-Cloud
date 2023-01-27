package com.opencbs.loans.workers;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class RollbackParams {
    private String comment;
    private LocalDateTime dateTime;
}
