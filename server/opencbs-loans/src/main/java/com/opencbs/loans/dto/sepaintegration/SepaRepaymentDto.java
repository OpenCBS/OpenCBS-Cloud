package com.opencbs.loans.dto.sepaintegration;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SepaRepaymentDto {

    private List<SepaIntegrationImportDto> data;

    private String documentUid;
}
