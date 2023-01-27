package com.opencbs.savings.repositories.implementations;

import com.opencbs.core.domain.enums.StatusType;
import com.opencbs.core.repositories.implementations.BaseRepository;
import com.opencbs.savings.domain.SavingProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.List;

@SuppressWarnings("unused")
public class SavingProductRepositoryImpl extends BaseRepository<SavingProduct> {

    public SavingProductRepositoryImpl(EntityManager entityManager) {
        super(entityManager, SavingProduct.class);
    }

    public Page<SavingProduct> searchByString(String searchString, List<StatusType> statusTypes, Pageable pageable) {
        searchString = searchString == null ? "%%%%" : String.format("%%%s%%", searchString);

        String querySql = "from SavingProduct sp where lower(sp.name) like lower(:searchString)";

        Query query = this.getEntityManager().createQuery(String.format("select count(sp.id) %s", querySql));
        query.setParameter("searchString", String.format("%%%s%%", searchString));
        long total = (long) query.getSingleResult();

        query = this.getEntityManager().createQuery(String.format("select sp %s", querySql), SavingProduct.class);
        query.setParameter("searchString", String.format("%%%s%%", searchString));
        query.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        query.setMaxResults(pageable.getPageSize());
        return new PageImpl<>((List<SavingProduct>) query.getResultList(), pageable, total);
    }
}
