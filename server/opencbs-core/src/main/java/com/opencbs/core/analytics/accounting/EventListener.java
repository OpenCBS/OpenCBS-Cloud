package com.opencbs.core.analytics.accounting;

import com.opencbs.core.accounting.domain.Account;
import com.opencbs.core.accounting.domain.AccountingEntry;
import com.opencbs.core.accounting.services.HelperAccountingService;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.HibernateException;
import org.hibernate.event.spi.PersistEvent;
import org.hibernate.event.spi.PersistEventListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

@Slf4j
@Component
public class EventListener implements PersistEventListener {

    private final HelperAccountingService helperAccountingService;


    @Autowired
    public EventListener(HelperAccountingService helperAccountingService) {
        this.helperAccountingService = helperAccountingService;
    }

    @Override
    public void onPersist(PersistEvent event) throws HibernateException {
        if (event.getObject().getClass() == AccountingEntry.class) {
            helperAccountingService.doWorkOverBalance((AccountingEntry) event.getObject());
        }

        if (event.getObject().getClass() == Account.class) {
            helperAccountingService.saveParentTagsForNewAccount((Account) event.getObject());
        }
    }

    @Override
    public void onPersist(PersistEvent event, Map createdAlready) throws HibernateException {

    }
}