package com.opencbs.core.repositories.implementations;

import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.domain.enums.ProfileType;
import com.opencbs.core.domain.profiles.Profile;
import com.opencbs.core.domain.profiles.SearchableProfile;
import com.opencbs.core.repositories.customs.ProfileRepositoryCustom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@SuppressWarnings("unused")
public class ProfileRepositoryImpl implements ProfileRepositoryCustom {

    private final EntityManager entityManager;

    protected ProfileRepositoryImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public Page<Profile> search(String searchString, Pageable pageable) {
        Query queryTotal = this.entityManager.createQuery(
                "select count(sp.id) from SearchableProfile sp " +
                        "where lower(sp.searchableContent) like lower(:searchString)");
        queryTotal.setParameter("searchString", "%" + searchString + "%");
        long total = (long) queryTotal.getSingleResult();

        TypedQuery<SearchableProfile> query =
                this.entityManager.createQuery("select sp from SearchableProfile sp " +
                        "where lower(sp.searchableContent) like lower(:searchString) " +
                        "order by sp.createdAt desc", SearchableProfile.class);
        query.setParameter("searchString", "%" + searchString + "%");
        query.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        query.setMaxResults(pageable.getPageSize());

        return getProfilesPage(query.getResultList(), pageable, total);
    }

    @Override
    public Page<Profile> findLiveAndPending(Pageable pageable) {
        String queryString = " from SearchableProfile sp " +
                "where lower(sp.status) like lower(:statusLive) or lower(sp.status) like lower(:statusPending)";

        Map<String, Object> searchParams = new HashMap();
        searchParams.put("statusLive", "%" + EntityStatus.LIVE.toString() + "%");
        searchParams.put("statusPending", "%" + EntityStatus.PENDING.toString() + "%");

        return this.doPageableQuery(queryString, searchParams, pageable);
    }

    @Override
    public Page<Profile> searchLiveAndPending(String searchString, Pageable pageable) {
        String queryString = " from SearchableProfile sp " +
                "where (lower(sp.status) like lower(:statusLive) or lower(sp.status) like lower(:statusPending)) " +
                "and lower(sp.searchableContent) like lower(:searchString)";

        Map<String, Object> searchParams = new HashMap();
        searchParams.put("statusLive", "%" + EntityStatus.LIVE.toString() + "%");
        searchParams.put("statusPending", "%" + EntityStatus.PENDING.toString() + "%");
        searchParams.put("searchString", "%" + searchString + "%");

        return this.doPageableQuery(queryString, searchParams, pageable);
    }

    @Override
    public Page<Profile> searchForCompany(ProfileType profileType, String searchString, List<Long> profileIds, Pageable pageable) {
        String queryString = " from SearchableProfile sp " +
                "where (lower(sp.status) like lower(:statusLive) or lower(sp.status) like lower(:statusPending)) " +
                "and type = :profileType ";
        queryString += searchString == null
                ? ""
                : " and lower(sp.searchableContent) like lower(:searchString) ";
        queryString += profileIds.isEmpty()
                ? ""
                : " and id not in (:profileIds)";

        Map<String, Object> searchParams = new HashMap();
        searchParams.put("statusLive", "%" + EntityStatus.LIVE.toString() + "%");
        searchParams.put("statusPending", "%" + EntityStatus.PENDING.toString() + "%");
        searchParams.put("profileType", profileType.toString());
        if (searchString != null) {
            searchParams.put("searchString", "%" + searchString + "%");
        }
        if (!profileIds.isEmpty()) {
            searchParams.put("profileIds", profileIds);
        }

        return this.doPageableQuery(queryString, searchParams, pageable);
    }

    @Override
    public Page<Profile> findLiveAndPendingThatHasLiveFields(Pageable pageable) {
        String queryString = " from SearchableProfile sp " +
                "where (lower(sp.status) like lower(:statusLive) or lower(sp.status) like lower(:statusPending)) " +
                "and lower(sp.customFieldValueStatuses) like lower(:statusLive)";

        Map<String, Object> searchParams = new HashMap();
        searchParams.put("statusLive", "%" + EntityStatus.LIVE.toString() + "%");
        searchParams.put("statusPending", "%" + EntityStatus.PENDING.toString() + "%");

        return this.doPageableQuery(queryString, searchParams, pageable);
    }

    @Override
    public Page<Profile> searchLiveAndPendingThatHasLiveFields(String searchString, Pageable pageable) {
        String queryString = " from SearchableProfile sp " +
                "where (lower(sp.status) like lower(:statusLive) or lower(sp.status) like lower(:statusPending)) " +
                "and lower(sp.searchableContent) like lower(:searchString) " +
                "and lower(sp.customFieldValueStatuses) like lower(:statusLive)";

        Map<String, Object> searchParams = new HashMap();
        searchParams.put("statusLive", "%" + EntityStatus.LIVE.toString() + "%");
        searchParams.put("statusPending", "%" + EntityStatus.PENDING.toString() + "%");
        searchParams.put("searchString", "%" + searchString + "%");

        return this.doPageableQuery(queryString, searchParams, pageable);
    }

    @Override
    public Page<Profile> searchAvailableGuarantors(String query, List<Long> ids, Pageable pageable) {
        String queryString = " from SearchableProfile sp " +
                "where (lower(sp.status) like lower(:statusLive) or lower(sp.status) like lower(:statusPending)) " +
                "and lower(sp.searchableContent) like lower(:searchString) " +
                "and lower(sp.customFieldValueStatuses) like lower(:statusLive) " +
                "and sp.id not in(:excludedIds)" +
                "and sp.type != 'GROUP'";

        String searchString = query == null ? "%%" : "%" + query + "%";

        Map<String, Object> searchParams = new HashMap();
        searchParams.put("statusLive", "%" + EntityStatus.LIVE.toString() + "%");
        searchParams.put("statusPending", "%" + EntityStatus.PENDING.toString() + "%");
        searchParams.put("searchString", searchString);
        searchParams.put("excludedIds", ids);

        return this.doPageableQuery(queryString, searchParams, pageable);
    }

    private Page<Profile> doPageableQuery(String queryString, Map<String, Object> searchParams, Pageable pageable) {
        Query queryTotal = entityManager.createQuery("select count(sp.id) " + queryString);
        this.setSearchParams(queryTotal, searchParams);
        long total = (long) queryTotal.getSingleResult();

        TypedQuery<SearchableProfile> query = this.entityManager.createQuery("select sp " + queryString + " order by sp.createdAt desc", SearchableProfile.class);
        this.setSearchParams(query, searchParams);
        query.setFirstResult(pageable.getPageSize() * pageable.getPageNumber());
        query.setMaxResults(pageable.getPageSize());

        return this.getProfilesPage(query.getResultList(), pageable, total);
    }

    private void setSearchParams(Query query, Map<String, Object> searchParams) {
        for (Map.Entry<String, Object> entry : searchParams.entrySet()) {
            query.setParameter(entry.getKey(), entry.getValue());
        }
    }

    private Page<Profile> getProfilesPage(List<SearchableProfile> searchableProfiles, Pageable pageable, long total) {
        List<Profile> profiles = searchableProfiles
                .stream()
                .map(x -> {
                    Profile profile = new Profile();
                    profile.setId(x.getId());
                    profile.setName(x.getName());
                    profile.setType(x.getType());
                    profile.setStatus(x.getStatus());
                    profile.setCreatedAt(x.getCreatedAt());
                    profile.setCreatedBy(x.getCreatedBy());
                    profile.setBranch(x.getBranch());
                    profile.setCurrentAccounts(x.getCurrentAccounts());
                    return profile;
                })
                .collect(Collectors.toList());

        return new PageImpl<>(profiles, pageable, total);
    }

}