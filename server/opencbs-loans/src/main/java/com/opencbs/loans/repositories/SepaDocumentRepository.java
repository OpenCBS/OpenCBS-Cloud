package com.opencbs.loans.repositories;

import com.opencbs.core.repositories.Repository;
import com.opencbs.loans.domain.SepaDocument;
import com.opencbs.loans.domain.enums.SepaDocumentType;

import java.util.List;

public interface SepaDocumentRepository extends Repository<SepaDocument> {

    List<SepaDocument> findAllByDocumentType(SepaDocumentType documentType);

    SepaDocument findByUid(String uid);
}
