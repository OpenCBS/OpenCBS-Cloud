package com.opencbs.loans.services.sepaintegration;

import com.opencbs.loans.dto.sepaintegration.SepaIntegrationExportDto;
import com.opencbs.loans.dto.sepaintegration.SepaRepaymentDto;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

public interface SepaIntegrationService {

    List<SepaIntegrationExportDto> getSepaIntegrationExportDtosByDate(LocalDate requiredDate);

    String getSepaExportXML(List<String> codes, LocalDate requiredDate);

    SepaRepaymentDto uploadAndParseXMLFile(MultipartFile importFile);

    void sepaRepayment(SepaRepaymentDto integrationImportDtoList);
}
