package com.opencbs.borrowings.services;

import com.opencbs.borrowings.domain.schedule.BorrowingInstallmentInterestAccrual;

import java.time.LocalDateTime;

public interface BorrowingInstallmentInterestAccrualService {

    BorrowingInstallmentInterestAccrual getCurrentInstallment(Long borrowingId, LocalDateTime currentDateTime);
}
