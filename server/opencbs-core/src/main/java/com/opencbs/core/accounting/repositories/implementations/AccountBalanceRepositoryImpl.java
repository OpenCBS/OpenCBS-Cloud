package com.opencbs.core.accounting.repositories.implementations;

import com.opencbs.core.accounting.domain.AccountBalance;
import com.opencbs.core.accounting.repositories.customs.AccountBalanceRepositoryCustom;
import com.opencbs.core.repositories.implementations.BaseRepository;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@SuppressWarnings("unused")
public class AccountBalanceRepositoryImpl extends BaseRepository<AccountBalance> implements AccountBalanceRepositoryCustom {
    public AccountBalanceRepositoryImpl(EntityManager entityManager) {
        super(entityManager, AccountBalance.class);
    }

    @Override
    public List<AccountBalance> getBalance(List<Long> ids, LocalDateTime date) {
        String sql = "select ab.*" +
                "from account_balances ab\n" +
                "  left join (select\n" +
                "               account_id,\n" +
                "               max(date) max_date\n" +
                "             from account_balances\n" +
                "             where date <= :date and account_balances.account_id in :ids\n" +
                "             group by account_id\n" +
                "            ) ab_child on ab_child.account_id = ab.account_id\n" +
                "where ab.date = ab_child.max_date";
        Query query = this.getEntityManager().createNativeQuery(sql, AccountBalance.class);
        query.setParameter("ids", ids);
        query.setParameter("date", date);
        List<AccountBalance> ss = new ArrayList<>();
        return (List<AccountBalance>) query.getResultList();
    }

    @Override
    public void recreateInOutFlow(LocalDate calculateDate) {
        Query query = this.getEntityManager().createNativeQuery("SELECT count(*) from update_in_out_cash_flow(?)");
        query.setParameter(1, calculateDate);
        query.getSingleResult();
    }

    @Override
    public void recalculateBalances(LocalDate date){
        Query query = this.getEntityManager().createNativeQuery("SELECT count(*) from _recalculate_balance(?)");
        query.setParameter(1, LocalDateTime.of(date, LocalTime.MAX));
        query.getSingleResult();
    }
}