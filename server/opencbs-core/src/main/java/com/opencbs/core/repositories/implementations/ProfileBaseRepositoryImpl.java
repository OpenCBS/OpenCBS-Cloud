package com.opencbs.core.repositories.implementations;

import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.repositories.customs.ProfileBaseRepositoryCustom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import java.util.HashMap;
import java.util.Map;

public abstract class ProfileBaseRepositoryImpl<T extends Profile> extends BaseRepository implements ProfileBaseRepositoryCustom<T> {

    ProfileBaseRepositoryImpl(EntityManager entityManager, Class<T> clazz) {
        super(entityManager, clazz);
    }

    @Override
    public Page<T> findLiveAndPendingThatHasLiveFields(Pageable pageable) {
        String queryString = " from " + clazz.getName() + " p left join p.customFieldValues cfv " +
                "where (lower(p.status) like lower(:statusLive) or lower(p.status) like lower(:statusPending)) " +
                "and lower(cfv.status) like lower(:statusLive)";

        Map<String, String> searchParams = new HashMap();
        searchParams.put("statusLive", "%" + EntityStatus.LIVE.toString() + "%");
        searchParams.put("statusPending", "%" + EntityStatus.PENDING.toString() + "%");

        return this.doPageableQuery(queryString, searchParams, pageable);
    }

    @Override
    public Page<T> searchLiveAndPendingThatHasLiveFields(String searchString, Pageable pageable) {
        String queryString = " from " + clazz.getName() + " p left join p.customFieldValues cfv " +
                "where (lower(p.status) like lower(:statusLive) or lower(p.status) like lower(:statusPending)) " +
                "and lower(p.name) like lower(:searchString) " +
                "and lower(cfv.status) like lower(:statusLive)";

        Map<String, String> searchParams = new HashMap();
        searchParams.put("statusLive", "%" + EntityStatus.LIVE.toString() + "%");
        searchParams.put("statusPending", "%" + EntityStatus.PENDING.toString() + "%");
        searchParams.put("searchString", "%" + searchString + "%");

        return this.doPageableQuery(queryString, searchParams, pageable);
    }

    private Page<T> doPageableQuery(String queryString, Map<String, String> searchParams, Pageable pageable) {
        Query queryTotal = this.getEntityManager().createQuery("select count(distinct p.id) " + queryString);
        this.setSearchParams(queryTotal, searchParams);
        long total = (long) queryTotal.getSingleResult();

        TypedQuery<T> query = this.getEntityManager().createQuery("select distinct p " + queryString + " order by p.createdAt desc", clazz);
        this.setSearchParams(query, searchParams);
        query.setFirstResult(pageable.getPageSize() * pageable.getPageNumber());
        query.setMaxResults(pageable.getPageSize());

        return new PageImpl<>(query.getResultList(), pageable, total);
    }

    private void setSearchParams(Query query, Map<String, String> searchParams) {
        for (Map.Entry<String, String> entry : searchParams.entrySet()) {
            query.setParameter(entry.getKey(), entry.getValue());
        }
    }
}
