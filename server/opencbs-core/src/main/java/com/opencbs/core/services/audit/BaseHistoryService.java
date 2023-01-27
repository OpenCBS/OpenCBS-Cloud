package com.opencbs.core.services.audit;

import com.opencbs.core.domain.BaseEntity;
import com.opencbs.core.domain.audit.AuditRevisionEntity;
import com.opencbs.core.dto.audit.ChangedDto;
import com.opencbs.core.dto.audit.HistoryDto;
import com.opencbs.core.helpers.DateHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.history.Revision;
import org.springframework.data.history.Revisions;
import org.springframework.data.repository.history.RevisionRepository;

import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;


public abstract class BaseHistoryService<T extends RevisionRepository> {

    private final RevisionRepository revisionRepository;

    @Autowired
    public BaseHistoryService(RevisionRepository revisionRepository) {
        this.revisionRepository = revisionRepository;
    }

    public List<HistoryDto> getAllRevisions(Long id) throws Exception {
        Revisions revisions = revisionRepository.findRevisions(id);
        return this.getListOfChanges(revisions.getContent());
    }

    public <T> HistoryDto getRevisionByDate(Long entityId, LocalDateTime dateTime) throws Exception {
        Revisions revisions = this.revisionRepository.findRevisions(entityId);
        BaseEntity prevObject = null;
        for (Object obj : revisions.getContent()) {
            Revision revision = ((Revision<Integer, T>)obj);
            LocalDateTime dateTimeRevision = DateHelper.dateToLocalDateTime(revision.getRevisionDate());
            if( DateHelper.equal(dateTimeRevision.toLocalDate(),dateTime.toLocalDate())) {
                return convertToHistoryDto(prevObject, revision);
            }
            prevObject = (BaseEntity) revision.getEntity();
        }
        return null;
    }

    private List<HistoryDto> getListOfChanges(List<Revision<Integer, T>> content) throws IllegalAccessException {
        List<HistoryDto> changes = new ArrayList<>();
        Object prevObject = null;
        for (Revision revision : content) {
            HistoryDto historyDto = convertToHistoryDto((BaseEntity) prevObject, revision);
            changes.add(historyDto);
            prevObject = revision.getEntity();
        }

        return changes;
    }

    private HistoryDto convertToHistoryDto(BaseEntity prevObject, Revision revision) throws IllegalAccessException {
        Class clazz = revision.getEntity().getClass();
        return HistoryDto.builder()
                .number(revision.getRevisionNumber().longValue())
                .date(DateHelper.toLocalDate(revision.getRevisionDate()))
                .changed(buildListOfChange((BaseEntity) revision.getEntity(), prevObject, clazz))
                .username(((AuditRevisionEntity) revision.getMetadata().getDelegate()).getUsername())
                .build();
    }

    private <E extends BaseEntity> List<ChangedDto> buildListOfChange(E entity, E prevObject, Class clazz) throws IllegalAccessException {
        if (clazz == BaseEntity.class) {
            return Collections.emptyList();
        }

        List<ChangedDto> changed = new ArrayList<>();
        for (Field field : clazz.getDeclaredFields()) {
            if (prevObject == null && entity == null) {
                continue;
            }
            field.setAccessible(true);
            Object prefValue = (prevObject == null) ? null : field.get(prevObject);
            if (!comparingValues(field.get(entity), prefValue)) {
                ChangedDto builder = ChangedDto.builder()
                        .fieldName(field.getName())
                        .prefValue((prefValue == null) ? "" : field.get(prevObject).toString())
                        .value(buildToString(field.get(entity)))
                        .build();
                changed.add(builder);
            }
        }
        changed.addAll(buildListOfChange(entity, prevObject, clazz.getSuperclass()));

        return changed;
    }

    private String buildToString(Object o) {
        if (o instanceof Iterable){
            StringBuilder sb = new StringBuilder("["+System.lineSeparator());
            ((Iterable)o).forEach(item->sb.append(item.toString()+";"+System.lineSeparator()));
            sb.append("]");
            return sb.toString();
        }

        return o.toString();
    }

    private Boolean comparingValues(Object first, Object second) {
        if (first == null && second == null) {
            return true;
        }
        if (first != null && first.equals(second)) {
            return true;
        }
        if (second != null && second.equals(first)) {
            return true;
        }

        return false;
    }

    public LocalDateTime getDateTimeLastRevision(Long entityId) throws Exception {
        return DateHelper.dateToLocalDateTime(this.revisionRepository.findLastChangeRevision(entityId).getRevisionDate());
    }
}
