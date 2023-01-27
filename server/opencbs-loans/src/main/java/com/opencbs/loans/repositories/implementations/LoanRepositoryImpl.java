package com.opencbs.loans.repositories.implementations;

import com.opencbs.core.domain.User;
import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.FileProvider;
import com.opencbs.core.repositories.implementations.BaseRepository;
import com.opencbs.loans.domain.Loan;
import com.opencbs.loans.domain.LoanAdditionalInfo;
import com.opencbs.loans.domain.SimplifiedLoan;
import com.opencbs.loans.domain.customfields.CollateralCustomFieldValue;
import com.opencbs.loans.domain.customfields.LoanApplicationCustomFieldValue;
import com.opencbs.loans.domain.enums.LoanStatus;
import com.opencbs.loans.repositories.customs.LoanRepositoryCustom;
import org.hibernate.Criteria;
import org.hibernate.criterion.*;
import org.hibernate.transform.Transformers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.Query;
import java.math.BigDecimal;

@Repository
public class LoanRepositoryImpl extends BaseRepository<Loan> implements LoanRepositoryCustom {

    protected LoanRepositoryImpl(EntityManager entityManager) {
        super(entityManager, Loan.class);
    }

    public Page<SimplifiedLoan> findAllLoans(String searchString, Pageable pageable) {
        Criteria criteria = this.createCriteria(SimplifiedLoan.class, "l");
        if (!StringUtils.isEmpty(searchString)) {
            searchString = searchString.trim();
            BigDecimal amountSearchPattern = null;
            try{
                amountSearchPattern = new BigDecimal(searchString);
            }catch (NumberFormatException exc){
            }

            DetachedCriteria subQueryLoanApplicationCustomField = DetachedCriteria.forClass(LoanApplicationCustomFieldValue.class, "lacfv");
            subQueryLoanApplicationCustomField.add(Restrictions.ilike("value", searchString, MatchMode.ANYWHERE))
                    .add(Restrictions.eq("status", EntityStatus.LIVE));
            subQueryLoanApplicationCustomField.setProjection(Projections.property("lacfv.owner.id"));

            DetachedCriteria subQueryCollaterals = DetachedCriteria.forClass(CollateralCustomFieldValue.class, "ccfv");
            subQueryCollaterals.createAlias("ccfv.collateral", "c");
            subQueryCollaterals.createAlias("c.typeOfCollateral", "toc");
            subQueryCollaterals.add(
                    Restrictions.disjunction(
                            Restrictions.and(Restrictions.ilike("ccfv.value", searchString, MatchMode.ANYWHERE)),
                            Restrictions.eq("status", EntityStatus.LIVE))
                            .add(Restrictions.ilike("c.name", searchString, MatchMode.ANYWHERE))
                            .add(Restrictions.eq("c.amount", amountSearchPattern))
                            .add(Restrictions.ilike("toc.caption", searchString, MatchMode.ANYWHERE))
            );
            subQueryCollaterals.setProjection(Projections.property("c.loanApplication.id"));

            DetachedCriteria subQueryGuarantors = DetachedCriteria.forClass(Loan.class, "loan");
            subQueryGuarantors.createAlias("loan.loanApplication", "la");
            subQueryGuarantors.createAlias("la.guarantors", "g");
            subQueryGuarantors.createAlias("g.profile", "p");
            subQueryGuarantors.add(Restrictions.ilike("p.name", searchString, MatchMode.ANYWHERE));
            subQueryGuarantors.setProjection(Projections.property("la.id"));

            DetachedCriteria subQueryLoanOfficer = DetachedCriteria.forClass(User.class, "loanOfficer");
            subQueryLoanOfficer.add(
                    Restrictions.disjunction(
                        Restrictions.ilike("loanOfficer.firstName", searchString, MatchMode.ANYWHERE))
                            .add(Restrictions.ilike("loanOfficer.lastName", searchString, MatchMode.ANYWHERE))
            );
            subQueryLoanOfficer.setProjection(Projections.property("loanOfficer.id"));

            Criterion where = Restrictions.and(
                Restrictions.disjunction(Restrictions.ilike("l.profileName", searchString, MatchMode.ANYWHERE))
                    .add(Restrictions.ilike("l.type", searchString, MatchMode.ANYWHERE))
                    .add(Restrictions.ilike("l.code", searchString, MatchMode.ANYWHERE))
                    .add(Restrictions.ilike("l.branchName", searchString, MatchMode.ANYWHERE))
                    .add(Restrictions.ilike("l.applicationCode", searchString, MatchMode.ANYWHERE))
                    .add(Subqueries.propertyIn("l.applicationId", subQueryLoanApplicationCustomField))
                    .add(Subqueries.propertyIn("l.applicationId", subQueryCollaterals))
                    .add(Subqueries.propertyIn("l.applicationId", subQueryGuarantors))
                    .add(Subqueries.propertyIn("l.loanOfficerId", subQueryLoanOfficer))
                    .add(Restrictions.ilike("l.creditLine", searchString, MatchMode.ANYWHERE)),
                Restrictions.ne("l.status", LoanStatus.PENDING)
            );
            criteria.add(where);
        }

        criteria.setProjection(Projections.rowCount());

        Long total = (Long) criteria.uniqueResult();

        criteria.setProjection(this.buildProjectionList());
        criteria.addOrder(Order.desc("l.createdAt"));
        criteria.setMaxResults(pageable.getPageSize());
        criteria.setFirstResult(pageable.getPageSize() * pageable.getPageNumber());
        criteria.setResultTransformer(Transformers.aliasToBean(SimplifiedLoan.class));

        return new PageImpl<>(criteria.list(), pageable, total);
    }

    private Projection buildProjectionList() {
        return Projections.projectionList()
                .add(Projections.property("l.id").as("id"))
                .add(Projections.property("l.profileName").as("profileName"))
                .add(Projections.property("l.amount").as("amount"))
                .add(Projections.property("l.code").as("code"))
                .add(Projections.property("l.interestRate").as("interestRate"))
                .add(Projections.property("l.applicationId").as("applicationId"))
                .add(Projections.property("l.applicationCode").as("applicationCode"))
                .add(Projections.property("l.type").as("type"))
                .add(Projections.property("l.productName").as("productName"))
                .add(Projections.property("l.createdBy").as("createdBy"))
                .add(Projections.property("l.status").as("status"))
                .add(Projections.property("l.createdAt").as("createdAt"))
                .add(Projections.property("l.branchName").as("branchName"))
                .add(Projections.property("l.currency").as("currency"))
                .add(Projections.property("l.disbursementDate").as("disbursementDate"))
                .add(Projections.property("l.maturityDate").as("maturityDate"))
                .add(Projections.property("l.loanOfficerId").as("loanOfficerId"))
                .add(Projections.property("l.creditLine").as("creditLine"))
                .add(Projections.property("l.creditLineOutstandingAmount").as("creditLineOutstandingAmount"));
    }

    @Override
    public LoanAdditionalInfo getAdditionalInfo(Long loanId) throws Exception {
        String queryString = FileProvider.getLoanScript("LoanAdditionalInfoScript.sql");
        Query query = this.getEntityManager().createNativeQuery(queryString,"loanAdditionalInfoMapper");
        query.setParameter("loanId", loanId);
        query.setParameter("dateTime", DateHelper.getLocalDateTimeNow());
        try {
            LoanAdditionalInfo result = (LoanAdditionalInfo) query.getSingleResult();
            return result;
        } catch (NoResultException e) {
            throw new Exception("Additional information on the loan was not found.");
        }
     }
}
