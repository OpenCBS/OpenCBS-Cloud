package com.opencbs.loans.repositories.implementations;

import com.opencbs.core.repositories.implementations.BaseRepository;
import com.opencbs.loans.domain.products.LoanProduct;
import com.opencbs.loans.dto.requests.LoanProductRequest;
import com.opencbs.loans.repositories.customs.LoanProductRepositoryCustom;
import org.hibernate.Criteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

import javax.persistence.EntityManager;
import java.util.List;
import java.util.stream.Collectors;

@SuppressWarnings("unused")
public class LoanProductRepositoryImpl extends BaseRepository<LoanProduct> implements LoanProductRepositoryCustom {

    public LoanProductRepositoryImpl(EntityManager entityManager) {
        super(entityManager, LoanProduct.class);
    }


    @Override
    public Page<LoanProduct> search(Pageable pageable, LoanProductRequest request) {
        String searchString = StringUtils.isEmpty(request.getSearch()) ? "" : request.getSearch();

        Criteria criteria = this.createCriteria("loanProduct")
                .add(
                        Restrictions.and(
                                Restrictions.or(Restrictions.like("loanProduct.name", searchString, MatchMode.ANYWHERE).ignoreCase(),
                                        Restrictions.like("loanProduct.code", searchString, MatchMode.ANYWHERE).ignoreCase())));
        if (!request.getStatusTypes().isEmpty()) {
            criteria.add(Restrictions.in("loanProduct.statusType", request.getStatusTypes()));
        }

        List<LoanProduct> results = criteria.list();
        results = results.stream()
                .filter(x -> (x.getAvailability() & request.getAvailability().getId()) == request.getAvailability().getId())
                .skip(pageable.getPageNumber() * pageable.getPageSize())
                .limit(pageable.getPageSize())
                .collect(Collectors.toList());

        return new PageImpl<>(results, pageable, criteria.list().size());
    }
}
