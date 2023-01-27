package com.opencbs.loans.dto.sepaintegration;

import com.opencbs.loans.domain.enums.SepaDocumentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class SepaDocumentUpdateForm {

    private SepaDocumentStatus documentStatus;
}
