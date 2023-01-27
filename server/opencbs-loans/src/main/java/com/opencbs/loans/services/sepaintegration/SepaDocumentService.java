package com.opencbs.loans.services.sepaintegration;

import com.opencbs.loans.domain.SepaDocument;
import com.opencbs.loans.domain.enums.SepaDocumentType;
import com.opencbs.loans.dto.sepaintegration.SepaDocumentCreateForm;
import com.opencbs.loans.dto.sepaintegration.SepaDocumentDto;
import com.opencbs.loans.dto.sepaintegration.SepaDocumentUpdateForm;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SepaDocumentService {

    SepaDocument create(SepaDocumentCreateForm form);

    SepaDocument update(SepaDocument entity, SepaDocumentUpdateForm form);

    Page<SepaDocumentDto> findAll(Pageable pageable);

    Page<SepaDocumentDto> findAllByType(Pageable pageable, SepaDocumentType documentType);

    SepaDocument getDocumentByCode(String code);
}
