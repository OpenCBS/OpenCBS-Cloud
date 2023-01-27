package com.opencbs.core.reports.impl;

import com.opencbs.core.reports.ExcelHelperService;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellUtil;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class ExcelHelperServiceImpl implements ExcelHelperService {

    @Override
    public Workbook createBook() {
        Workbook workbook = new SXSSFWorkbook();

        Font font = workbook.createFont();

        font.setFontHeightInPoints((short)11);
        font.setFontName("Calibri");
        font.setItalic(true);
        font.setStrikeout(true);

        return workbook;
    }

    @Override
    public Sheet addSheet(@NonNull Workbook workbook, @NonNull String sheetName) {
        return workbook.createSheet(sheetName);
    }

    @Override
    public void setColumnWidthInPixel(Sheet sheet, int column, int widthInPixel) {
        sheet.setColumnWidth(column,MSExcelUtil.pixel2WidthUnits(widthInPixel));
    }

    @Override
    public void writeValue(@NonNull Sheet sheet, @NonNull Integer columnPosition, @NonNull Integer rowPosition, @NonNull String value) {
        Row row = CellUtil.getRow(rowPosition,sheet);
        Cell cell = row.getCell(columnPosition);
        if (cell == null) {
            cell = row.createCell(columnPosition);
        }
        cell.setCellValue(value);
        setDefaultFont(cell);
    }

    private void setDefaultFont(Cell cell) {
        Font font = cell.getSheet().getWorkbook().getFontAt((short) 0);
        cell.getCellStyle().setFont(font);
    }

    @Override
    public void setBottomBorder(Sheet sheet, Integer columnFrom, Integer columnTo, Integer rowNumber, BorderStyle borderStyle) {
        CellStyle cellStyle =sheet.getWorkbook().createCellStyle();
                //CellUtil.getCell(CellUtil.getRow(rowNumber, sheet),columnFrom).getCellStyle();
        cellStyle.setBorderBottom(borderStyle);
        setStyle(sheet, columnFrom, columnTo, rowNumber, cellStyle);
    }

    @Override
    public void setTopBorder(Sheet sheet, Integer columnFrom, Integer columnTo, Integer rowNumber, BorderStyle borderStyle) {
        CellStyle cellStyle = CellUtil.getCell(CellUtil.getRow(rowNumber, sheet),columnFrom).getCellStyle();
        cellStyle.setBorderTop(borderStyle);
        setStyle(sheet, columnFrom, columnTo, rowNumber, cellStyle);
    }

    @Override
    public void setBoldFont(Sheet sheet, int columnNumber, Integer maxColumnNumber, Integer rowNumber) {
        CellStyle cellStyle = CellUtil.getCell(CellUtil.getRow(rowNumber, sheet), columnNumber).getCellStyle();
        Font font = sheet.getWorkbook().getFontAt(cellStyle.getFontIndex());
        font.setBold(true);
        cellStyle.setFont(font);

        setStyle(sheet, columnNumber, maxColumnNumber, rowNumber, cellStyle);
    }

    public void setRightBorder(Sheet sheet, Integer columnNumber, Integer rowNumber, BorderStyle borderStyle) {
        Row row = CellUtil.getRow(rowNumber, sheet);
        Cell cell = CellUtil.getCell(row,columnNumber);
        CellStyle cellStyle = cell.getCellStyle();//sheet.getWorkbook().createCellStyle();
        cellStyle.setBorderRight(borderStyle);
        //cell.setCellStyle(cellStyle);
    }

    private void setStyle(Sheet sheet, Integer columnFrom, Integer columnTo, Integer rowNumber, CellStyle cellStyle) {
        Row row = CellUtil.getRow(rowNumber, sheet);

        for (int j = columnFrom; j <= columnTo; j++) {
            Cell cell = CellUtil.getCell(row, j);
            cell.setCellStyle(cellStyle);
        }
    }

}
