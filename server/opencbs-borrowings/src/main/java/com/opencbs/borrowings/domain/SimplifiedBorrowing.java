package com.opencbs.borrowings.domain;

import com.opencbs.borrowings.domain.enums.BorrowingStatus;
import lombok.Data;

@Data
public class SimplifiedBorrowing extends BorrowingBaseEntity {

    private String profileName;

    private String firstName;

    private String lastName;

    private String loanProductName;

    private BorrowingStatus status;

    public String getUserName() {
        return String.format("%s %s", this.firstName, this.lastName);
    }
}
