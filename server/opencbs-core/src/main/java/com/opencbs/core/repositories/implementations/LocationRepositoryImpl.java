package com.opencbs.core.repositories.implementations;

import com.opencbs.core.domain.trees.Location;
import com.opencbs.core.repositories.customs.LocationsRepositoryCustom;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.math.BigInteger;

@SuppressWarnings("unused")
public class LocationRepositoryImpl extends TreeEntityRepositoryImpl<Location> implements LocationsRepositoryCustom {

    @Autowired
    protected LocationRepositoryImpl(EntityManager entityManager) {
        super(entityManager, Location.class);
    }

    public Page<Location> search (String searchString, Pageable pageable) {
        searchString = searchString == null ? "%%%%" : String.format("%%%s%%", searchString);

        String queryString = "with recursive temp1 ( \"id\", \"parent\", \"name\", PATH, LEVEL ) as ( " +
                "    select " +
                "        T1.id, " +
                "        T1.parent_id, " +
                "        T1.name, " +
                "        CAST(T1.name as varchar(50)) as PATH, " +
                "        1 " +
                "    from locations T1 " +
                "    where T1.parent_id is null " +
                "    union " +
                "    select " +
                "        T2.id, " +
                "        T2.parent_id, " +
                "        T2.name, " +
                "        CAST(temp1.PATH || ' -> ' || T2.name as varchar(50)), " +
                "        LEVEL + 1 " +
                "    from locations T2 inner join temp1 on (temp1.\"id\" = T2.parent_id))";
        Query queryTotal = this.getEntityManager().createNativeQuery(queryString +"select count(*) from temp1 " +
                "    where lower(name) like lower(:searchString)");
        queryTotal.setParameter("searchString", searchString);
        BigInteger total = (BigInteger) queryTotal.getSingleResult();

        Query query = this.getQuery(queryString);
        query.setParameter("searchString", searchString);
        query.setFirstResult(pageable.getPageSize() * pageable.getPageNumber());
        query.setMaxResults(pageable.getPageSize());

        return new PageImpl<>(query.getResultList(), pageable, total.longValue());
    }

    private Query getQuery(String queryString) {
        queryString = queryString + " select " +
                "    id, " +
                "    parent      parent_id, " +
                "    name || ' (' || PATH || ')'     \"name\" " +
                "from temp1 " +
                "    where lower(name) like lower(:searchString) " +
                "order by name";
        return this.getEntityManager().createNativeQuery(queryString, Location.class);
    }
}
