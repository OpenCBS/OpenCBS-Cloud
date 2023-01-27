package com.opencbs.core.services.audit;

import com.opencbs.core.dto.audit.HistoryDto;

import java.time.LocalDateTime;
import java.util.List;

public interface HistoryService {

    List<HistoryDto> getAllRevisions(Long id) throws Exception;

    <T> HistoryDto getRevisionByDate(Long entityId, LocalDateTime dateTime) throws Exception;

    LocalDateTime getDateTimeLastRevision(Long entityId) throws Exception;

    Class getTargetClass();
}
