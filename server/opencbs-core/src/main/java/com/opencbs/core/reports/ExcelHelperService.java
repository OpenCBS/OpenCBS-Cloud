package com.opencbs.core.reports;

import lombok.NonNull;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

public interface ExcelHelperService {
    Workbook createBook();

    Sheet addSheet(@NonNull Workbook workbook, @NonNull String sheetName);

    void setColumnWidthInPixel(Sheet sheet, int column, int widthInPixel);

    void writeValue(Sheet sheet, Integer column, Integer row, String value);

    void setBottomBorder(Sheet sheet, Integer column, Integer columnTo, Integer row, BorderStyle borderStyle);

    void setTopBorder(Sheet sheet, Integer columnFrom, Integer columnTo, Integer row, BorderStyle borderStyle);

    void setBoldFont(Sheet sheet, int columnNumber, Integer maxColumnNumber, Integer rowNumber);

    //void setRightBorder(Sheet sheet, Integer columnNumber, Integer rowNumber, BorderStyle borderStyle);
}
