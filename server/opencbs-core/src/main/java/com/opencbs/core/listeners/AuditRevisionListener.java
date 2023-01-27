package com.opencbs.core.listeners;

import com.opencbs.core.domain.audit.AuditRevisionEntity;
import com.opencbs.core.helpers.UserHelper;
import org.hibernate.envers.RevisionListener;

public class AuditRevisionListener implements RevisionListener {

    @Override
    public void newRevision(Object revisionEntity) {
        AuditRevisionEntity audit = (AuditRevisionEntity) revisionEntity;
        audit.setUsername(UserHelper.getCurrentUser().getUsername());
    }
}