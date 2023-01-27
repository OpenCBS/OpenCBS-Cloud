package com.opencbs.core.repositories.implementations;

import com.opencbs.core.domain.taskmanager.TaskEventParticipantsEntity;
import com.opencbs.core.repositories.customs.TaskEventsParticipantsRepositoryCustom;
import org.hibernate.Criteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.math.BigInteger;
import java.util.List;

@SuppressWarnings("unused")
@Repository
public class TaskEventsParticipantsRepositoryRepositoryImpl extends BaseRepository<TaskEventParticipantsEntity> implements TaskEventsParticipantsRepositoryCustom {

    @Autowired
    public TaskEventsParticipantsRepositoryRepositoryImpl(EntityManager entityManager) {
        super(entityManager, TaskEventParticipantsEntity.class);
    }

    @Override
    public List<TaskEventParticipantsEntity> findAllTaskEventParticipants(String searchString, Pageable pageable) {
        Criteria criteria = createCriteria("r");

        if (searchString !=null) {
            criteria.add(Restrictions.ilike("r.name", searchString, MatchMode.ANYWHERE ));
        }

        if (pageable!=null){
            criteria.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
            criteria.setMaxResults(pageable.getPageSize());
        }

        return criteria.list();
    }
}