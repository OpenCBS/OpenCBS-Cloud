package com.opencbs.core.accounting.domain;

import lombok.Data;

@Data
public class ExtendedAccount extends Account {

    private Boolean hasChildren;

}
