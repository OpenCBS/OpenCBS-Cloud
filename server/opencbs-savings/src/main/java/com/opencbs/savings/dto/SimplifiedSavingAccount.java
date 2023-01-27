package com.opencbs.savings.dto;

import com.opencbs.core.dto.SimplifiedProfileAccount;
import lombok.Data;

@Data
public class SimplifiedSavingAccount extends SimplifiedProfileAccount {

    private long savingId;
}
