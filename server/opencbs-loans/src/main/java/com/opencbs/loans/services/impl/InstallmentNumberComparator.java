package com.opencbs.loans.services.impl;

import com.opencbs.core.domain.schedule.Installment;

import java.util.Comparator;

public class InstallmentNumberComparator implements Comparator<Installment> {

    @Override
    public int compare(Installment o1, Installment o2) {
        if (o1.getNumber() == o2.getNumber()) {
            return 0;
        }

        return o1.getNumber() > o2.getNumber() ? 1 : -1;
    }
}
