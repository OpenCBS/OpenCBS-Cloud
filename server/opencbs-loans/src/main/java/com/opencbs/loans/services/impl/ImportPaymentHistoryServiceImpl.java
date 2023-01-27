package com.opencbs.loans.services.impl;

import com.opencbs.core.domain.customfields.PersonCustomField;
import com.opencbs.core.domain.customfields.PersonCustomFieldValue;
import com.opencbs.core.domain.enums.EntityStatus;
import com.opencbs.core.domain.profiles.Person;
import com.opencbs.core.helpers.DateHelper;
import com.opencbs.core.helpers.UserHelper;
import com.opencbs.core.repositories.customFields.PersonCustomFieldRepository;
import com.opencbs.core.repositories.customFields.PersonCustomFieldValueRepository;
import com.opencbs.core.services.customFields.PersonCustomFieldService;
import com.opencbs.loans.domain.ImportPaymentHistory;
import com.opencbs.loans.dto.impotrpaymenthistory.ImportPaymentHistoryDto;
import com.opencbs.loans.dto.impotrpaymenthistory.RepaymentHistoryFilterDto;
import com.opencbs.loans.mappers.ImportPaymentHistoryMapper;
import com.opencbs.loans.repositories.ImportPaymentHistoryRepository;
import com.opencbs.loans.services.ImportPaymentHistoryService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ImportPaymentHistoryServiceImpl implements ImportPaymentHistoryService {

    private final ImportPaymentHistoryRepository repository;
    private final ImportPaymentHistoryMapper mapper;
    private final PersonCustomFieldValueRepository personCustomFieldValueRepository;
    private final PersonCustomFieldRepository personCustomFieldRepository;
    private final PersonCustomFieldService personCustomFieldService;

    @Override
    public List<ImportPaymentHistoryDto> getList(RepaymentHistoryFilterDto filterDto) {

        return this.repository.findAllByPaymentDateBetween(
                LocalDateTime.of(filterDto.getFromDate(), LocalTime.MIN),
                LocalDateTime.of(filterDto.getToDate(), LocalTime.MAX)).stream()
                .map(this.mapper::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ResponseEntity getImportPaymentHistoryExcel(List<ImportPaymentHistory> entities) {

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Workbook workbook = this.writeLine(entities);
            workbook.write(out);

            entities.forEach(i -> {
                i.setUploadingDate(DateHelper.getLocalDateTimeNow());
                this.repository.save(i);
            });
            return this.getBody()
                    .body(new InputStreamResource(new ByteArrayInputStream(out.toByteArray())));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    private Workbook writeLine(List<ImportPaymentHistory> entities) {
        int rowCount = 1;
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("ImportPaymentHistory");
        Row row = sheet.createRow(0);

        CellStyle style = workbook.createCellStyle();
        XSSFFont font = (XSSFFont) workbook.createFont();
        font.setBold(true);
        font.setFontHeight(16);
        style.setFont(font);

        createCell(sheet, row, 0, "Formatted Number", style);
        createCell(sheet, row, 1, "CustomerName", style);
        createCell(sheet, row, 2, "Formatted Number(T-account)", style);
        createCell(sheet, row, 3, "Repayment amount", style);
        createCell(sheet, row, 4, "Date", style);
        createCell(sheet, row, 5, "Partner", style);

        CellStyle styleData = workbook.createCellStyle();
        XSSFFont fontData = (XSSFFont) workbook.createFont();
        fontData.setFontHeight(14);
        styleData.setFont(fontData);

        for (ImportPaymentHistory entity : entities) {
            Row row2 = sheet.createRow(rowCount++);
            int columnCount = 0;
            createCell(sheet, row2, columnCount++, entity.getFormattedNumber(), styleData);
            createCell(sheet, row2, columnCount++, entity.getCustomerName(), styleData);
            createCell(sheet, row2, columnCount++, entity.getTechnicalAccountNumber(), styleData);
            createCell(sheet, row2, columnCount++, entity.getRepaymentAmount(), styleData);
            createCell(sheet, row2, columnCount++, entity.getPaymentDate(), styleData);
            createCell(sheet, row2, columnCount, entity.getPartnerName(), styleData);
        }
        return workbook;
    }

    private void createCell(Sheet sheet, Row row, int columnCount, Object value, CellStyle style) {
        sheet.autoSizeColumn(columnCount);
        Cell cell = row.createCell(columnCount);
        if (value instanceof Integer) {
            cell.setCellValue((Integer) value);
        } else if (value instanceof Boolean) {
            cell.setCellValue((Boolean) value);
        } else if (value instanceof BigDecimal) {
            cell.setCellValue(String.valueOf(((BigDecimal) value).doubleValue()));
        } else if (value instanceof LocalDateTime) {
            cell.setCellValue(String.valueOf((LocalDateTime) value));
        } else {
            cell.setCellValue((String) value);
        }
        cell.setCellStyle(style);
    }

    @Override
    public List<ImportPaymentHistory> findAll() {
        return new ArrayList<>(this.repository.findAll());
    }

    @Override
    public List<ImportPaymentHistory> findAllByIds(List<Long> ids) {
        return repository.findAllByIdIn(ids);
    }

    @Override
    public Long addPayment(ImportPaymentHistoryDto dto) {
        Optional<PersonCustomField> tAccountNumber = this.personCustomFieldRepository.findByName("t_account_number");
        PersonCustomFieldValue byOwnerAndCustomField = personCustomFieldValueRepository.findByOwnerAndCustomField(getPerson(dto), tAccountNumber.get());
        ImportPaymentHistory entity = new ImportPaymentHistory();
        entity.setCreatedAt(DateHelper.getLocalDateTimeNow());
        entity.setPaymentDate(dto.getPaymentDate());
        entity.setPartnerName(UserHelper.getCurrentUser().getUsername());
        entity.setRepaymentAmount(dto.getRepaymentAmount());
        entity.setFormattedNumber(dto.getFormattedNumber());
        entity.setCustomerName(getPerson(dto).getName());
        entity.setTechnicalAccountNumber(byOwnerAndCustomField.getValue());
        entity.setUploadingDate(null);
        this.repository.save(entity);
        return entity.getId();
    }

    @Override
    public Person getClientInfo(String contract) {
        Optional<PersonCustomField> passport = this.personCustomFieldRepository.findByName("passport");
        Optional<PersonCustomFieldValue> oneByFieldIdAndStatusAndValue =
                personCustomFieldService.findOneByFieldIdAndStatusAndValue(passport.get().getId(), EntityStatus.LIVE, contract);
        return oneByFieldIdAndStatusAndValue.get().getOwner();
    }

    private Person getPerson(ImportPaymentHistoryDto dto) {

        Optional<PersonCustomFieldValue> oneByFieldIdAndStatusAndValue =
                personCustomFieldService.findOneByFieldIdAndStatusAndValue(
                        personCustomFieldService.findByName("passport").get().getId(),
                        EntityStatus.LIVE, dto.getFormattedNumber());
        return oneByFieldIdAndStatusAndValue.get().getOwner();
    }

    ResponseEntity.BodyBuilder getBody() {
        String fileName = String.format("%s_%s", "some", DateHelper.getLocalDateTimeNow().toString());
        return ResponseEntity
                .ok()
                .header(HttpHeaders.CONTENT_TYPE,
                        "application/vnd.ms-excel")
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        String.format("attachment; filename=\"%s.xlsx\"", fileName));
    }

}
