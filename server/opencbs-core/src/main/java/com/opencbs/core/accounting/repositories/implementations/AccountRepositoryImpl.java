package com.opencbs.core.accounting.repositories.implementations;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountExtendedTag;
import com.opencbs.core.accounting.repositories.customs.AccountRepositoryCustom;
import com.opencbs.core.domain.Branch;
import com.opencbs.core.domain.enums.AccountType;
import com.opencbs.core.dto.requests.AccountRequest;
import com.opencbs.core.repositories.implementations.BaseRepository;
import org.hibernate.Criteria;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.hibernate.sql.JoinType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.util.StringUtils;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

@SuppressWarnings("unused")
public class AccountRepositoryImpl extends BaseRepository<Account> implements AccountRepositoryCustom {

    @Autowired
    public AccountRepositoryImpl(EntityManager entityManager) {
        super(entityManager, Account.class);
    }

    @Override
    public List<Account> findRootAccounts() {
        Criteria criteria = createCriteria("a");
        criteria.add(Restrictions.isNull("a.parent"));

        return criteria.list();
    }

    @Override
    public List<Account> findLeavesByParent(Pageable pageable, Account account) {
        Criteria criteria = createCriteria("a");
        criteria.add(Restrictions.eq("a.parent", account));
        criteria.addOrder(Order.asc("a.id"));
        criteria.setMaxResults(pageable.getPageSize());
        criteria.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        return criteria.list();
    }

    @Override
    public List<Account> findLeavesByParentAndBranch(Pageable pageable, Account account, Branch branch) {
        Criteria criteria = createCriteria("a");
        criteria.add(Restrictions.eq("a.parent", account));
        criteria.add(Restrictions.eq("a.branch", branch));
        criteria.addOrder(Order.asc("a.id"));
        criteria.setMaxResults(pageable.getPageSize());
        criteria.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        return criteria.list();
    }

    @Override
    public Page<Account> search(Long currencyId, String searchString, List<AccountType> accountTypes, AccountRequest.TypeOfAccount typeOfAccount, Pageable pageable) {
        Criteria criteria = createCriteria("a");
        criteria.createAlias("a.currency","currency", JoinType.LEFT_OUTER_JOIN);
        criteria.createAlias("a.branch","branch");

        if (!StringUtils.isEmpty(searchString)) {
            criteria.add(
                Restrictions.disjunction(Restrictions.ilike("a.number", searchString, MatchMode.ANYWHERE))
                        .add(Restrictions.ilike("a.name", searchString, MatchMode.ANYWHERE))
                        .add(Restrictions.ilike("currency.name", searchString, MatchMode.ANYWHERE))
                        .add(Restrictions.ilike("branch.name", searchString, MatchMode.ANYWHERE)));
        }
        if (currencyId != null) {
            criteria.add(Restrictions.eq("currency.id", currencyId));
        }
        criteria.add(Restrictions.in("a.type", accountTypes));
        if (typeOfAccount != null) {
            criteria.add(Restrictions.eq("a.isDebit", (AccountRequest.TypeOfAccount.DEBIT.equals(typeOfAccount))));
        }

        criteria.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        criteria.setMaxResults(pageable.getPageSize());

        List<Account> accounts = criteria.list();

        criteria.setFirstResult(0);
        criteria.setProjection(Projections.rowCount());

        return new PageImpl<>(accounts, pageable, (Long) criteria.uniqueResult());
    }

    @Override
    public Page<Account> searchCurrentAccounts(long accountTagId, String searchString, AccountType accountType, Pageable pageable) {
        Criteria accountTag = createCriteria(AccountExtendedTag.class,"aet");
        accountTag.createAlias("aet.account", "account");
        accountTag.add(
                Restrictions.disjunction(Restrictions.ilike("account.number", searchString, MatchMode.ANYWHERE))
                        .add(Restrictions.ilike("account.name", searchString, MatchMode.ANYWHERE))
        );
        accountTag.add(Restrictions.eq("account.type", accountType));
        accountTag.add(Restrictions.eq("aet.accountTag.id", accountTagId));

        accountTag.setFirstResult(pageable.getPageNumber() * pageable.getPageSize());
        accountTag.setMaxResults(pageable.getPageSize());

        List<Account> accounts = new ArrayList<>();
        List<AccountExtendedTag> accountExtendedTags = accountTag.list();

        for (AccountExtendedTag accountExtendedTag : accountExtendedTags) {
            accounts.add(accountExtendedTag.getAccount());
        }

        accountTag.setFirstResult(0);
        accountTag.setProjection(Projections.rowCount());

        return new PageImpl<>(accounts, pageable, (Long) accountTag.uniqueResult());
    }

    @Override
    public List<Long> findAllAccountIdByParentId(Long parentId) {
        Criteria criteria = createCriteria("a");
        criteria.add(Restrictions.eq("a.parent.id", parentId));
        criteria.setProjection(Projections.projectionList().add(Projections.property("a.id")));
        return criteria.list();
    }

    @Override
    public AccountType getAccountTypeByAccountId(Long accountId) {
        Criteria criteria = createCriteria("a");
        criteria.add(Restrictions.eq("a.id", accountId));
        criteria.setProjection(Projections.projectionList().add(Projections.property("a.type")));
        AccountType type = (AccountType) criteria.uniqueResult();
        return type;
    }
}
