package com.opencbs.savings.repositories.implementations;

import com.opencbs.core.repositories.implementations.BaseRepository;
import com.opencbs.savings.domain.Saving;
import com.opencbs.savings.domain.SavingSimplified;
import com.opencbs.savings.domain.enums.SavingAccountRuleType;
import com.opencbs.savings.dto.SavingWithAccountDto;
import com.opencbs.savings.repositories.customs.SavingRepositoryCustom;
import org.hibernate.Criteria;
import org.hibernate.criterion.*;
import org.hibernate.transform.Transformers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

import javax.persistence.EntityManager;
import java.util.List;

@SuppressWarnings("unused")
public class SavingRepositoryImpl extends BaseRepository<Saving> implements SavingRepositoryCustom {

    public SavingRepositoryImpl(EntityManager entityManager) {
        super(entityManager, Saving.class);
    }

    @Override
    public Page<SavingSimplified> getAll(String searchString, Pageable pageable) {
        Criterion criterion = Restrictions.or(
                Restrictions.like("saving.code", searchString, MatchMode.ANYWHERE).ignoreCase(),
                Restrictions.like("profile.name", searchString, MatchMode.ANYWHERE).ignoreCase()
        );

        Criteria criteria = this.getCriteria();
        criteria.createCriteria("profile", "profile");
        criteria.createCriteria("savingOfficer", "savingOfficer");
        criteria.createCriteria("product", "product");
        criteria.add(criterion);

        long total = (long) criteria.setProjection(Projections.rowCount()).uniqueResult();
        criteria.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        criteria.setMaxResults(pageable.getPageSize());
        criteria.addOrder(Order.desc("createdAt"));

        criteria.setProjection(this.getProjectionSavingList());
        criteria.setResultTransformer(Transformers.aliasToBean(SavingSimplified.class));
        List<SavingSimplified> results = (List<SavingSimplified>) criteria.list();
        return new PageImpl<>(results, pageable, total);
    }

    public Page<SavingWithAccountDto> getAllSimplifiedSavingAccount(String searchString, Pageable pageable) {
        Criteria criteria = this.createCriteria(Saving.class, "s");
        criteria.createAlias("s.profile", "p");
        criteria.createAlias("s.product", "sp");
        criteria.createAlias("p.currentAccounts", "currentAccount");
        criteria.createAlias("s.accounts", "savingAccount");
        criteria.createAlias("currentAccount.currency", "c2");
        criteria.createAlias("savingAccount.account", "account");

        if (!StringUtils.isEmpty(searchString)) {
            Criterion where = Restrictions.or(
                    Restrictions.like("account.number", searchString, MatchMode.ANYWHERE).ignoreCase(),
                    Restrictions.like("p.name", searchString, MatchMode.ANYWHERE).ignoreCase()
            );
            criteria.add(where);
        }
        Criterion criterion = Restrictions.and(
                Restrictions.like("savingAccount.type", SavingAccountRuleType.SAVING),
                Restrictions.eqProperty("currentAccount.currency", "sp.currency")
        );
        criteria.add(criterion);

        long total = (long) criteria.setProjection(Projections.rowCount()).uniqueResult();

        criteria.setProjection(buildProjectionList());

        criteria.setMaxResults(pageable.getPageSize());
        criteria.setFirstResult(pageable.getPageSize() * pageable.getPageNumber());

        criteria.setResultTransformer(Transformers.aliasToBean(SavingWithAccountDto.class));
        List<SavingWithAccountDto> results = (List<SavingWithAccountDto>) criteria.list();

        return new PageImpl<>(results, pageable, total);
    }

    private Criteria getCriteria() {
        Criteria criteria = this.createCriteria("saving");
        criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);
        return criteria;
    }

    private ProjectionList getProjectionSavingList() {
        ProjectionList projectionList = Projections.projectionList();
        projectionList.add(Projections.property("saving.id").as("id"));
        projectionList.add(Projections.property("saving.code").as("code"));
        projectionList.add(Projections.property("saving.status").as("status"));
        projectionList.add(Projections.property("profile.name").as("profileName"));
        projectionList.add(Projections.property("profile.id").as("profileId"));
        projectionList.add(Projections.property("savingOfficer.firstName").as("savingOfficerFirstName"));
        projectionList.add(Projections.property("savingOfficer.lastName").as("savingOfficerLastName"));
        projectionList.add(Projections.property("savingOfficer.id").as("savingOfficerId"));
        projectionList.add(Projections.property("saving.openDate").as("openDate"));
        projectionList.add(Projections.property("product.name").as("productName"));
        projectionList.add(Projections.property("product.id").as("productId"));
        return projectionList;
    }

    private ProjectionList buildProjectionList() {
        ProjectionList projectionList = Projections.projectionList();
        projectionList.add(Projections.property("currentAccount.id").as("id"));
        projectionList.add(Projections.property("p.name").as("name"));
        projectionList.add(Projections.property("account.number").as("number"));
        projectionList.add(Projections.property("account.id").as("accountId"));
        projectionList.add(Projections.property("p.id").as("profileId"));
        projectionList.add(Projections.property("s.id").as("savingId"));
        projectionList.add(Projections.property("c2.name").as("currency"));
        return projectionList;
    }
}
