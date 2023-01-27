package com.opencbs.savings.dto;

import com.opencbs.core.dto.SimplifiedProfileAccount;
import lombok.Data;

@Data
public class SavingWithAccountDto extends SimplifiedProfileAccount {

    private long savingId;

    private long accountId;

    private String number;

    private String nameWithNumber;

    public String getName(){
        return  super.getName() + " | " + getNumber();
    }

}
