package com.opencbs.loans.services.impl;

import com.google.common.collect.ImmutableList;
import com.opencbs.loans.domain.LoanInstallment;
import com.opencbs.loans.repositories.LoanInstallmentRepository;
import com.opencbs.loans.services.LoanInstallmentInterestAccrualService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LoanInstallmentInterestAccrualServiceImpl implements LoanInstallmentInterestAccrualService {

    private final LoanInstallmentRepository loanInstallmentRepository;


    @Override
    public LocalDate getAccrualDate(@NonNull Long loanId, @NonNull Integer installmentNumber) {
        ImmutableList<LoanInstallment> schedule = loanInstallmentRepository.findByLoanIdAndDateTime(loanId, null);
        Optional<LoanInstallment> installment = schedule.stream().filter(x -> x.getNumber() == installmentNumber).findFirst();
        return installment.map(LoanInstallment::getLastAccrualDate).orElse(null);
    }

    @Override
    public BigDecimal getInstallmentInterest(@NonNull Long loanId, @NonNull Integer installmentNumber) {
        ImmutableList<LoanInstallment> schedule = loanInstallmentRepository.findByLoanIdAndDateTime(loanId, null);
        Optional<LoanInstallment> installment = schedule.stream().filter(x -> x.getNumber() == installmentNumber).findFirst();
        return installment.map(LoanInstallment::getInterest)
                .orElseThrow(() -> new RuntimeException("Loan installment not found"));
    }

    @Override
    public BigDecimal getInstallmentOlb(@NonNull Long loanId, @NonNull LocalDate currentDay) {
        ImmutableList<LoanInstallment> schedule = loanInstallmentRepository.findByLoanIdAndDateTime(loanId, null);
        if (!schedule.isEmpty()) {
            return schedule
                    .stream()
                    .filter(x -> x.getLastAccrualDate().isAfter(currentDay.minusDays(1)))
                    .min(Comparator.comparing(LoanInstallment::getNumber))
                    .get()
                    .getOlb();
        }
        return null;
    }

    @Override
    public LocalDate getLastAccrualDate(@NonNull Long loanId, @NonNull LocalDate currentDay) {
        ImmutableList<LoanInstallment> schedule = loanInstallmentRepository.findByLoanIdAndDateTime(loanId, null);
        if (!schedule.isEmpty()) {
            return schedule
                    .stream()
                    .filter(x -> x.getLastAccrualDate().isAfter(currentDay.minusDays(1)))
                    .min(Comparator.comparing(LoanInstallment::getNumber))
                    .get()
                    .getLastAccrualDate();
        }
        return null;
    }

    @Override
    public Integer getInstallmentNumber(@NonNull Long loanId, @NonNull LocalDate currentDay) {
        ImmutableList<LoanInstallment> schedule = loanInstallmentRepository.findByLoanIdAndDateTime(loanId, null);
        if (!schedule.isEmpty()) {
            return schedule
                    .stream()
                    .filter(x -> x.getLastAccrualDate().isAfter(currentDay.minusDays(1)))
                    .min(Comparator.comparing(LoanInstallment::getNumber))
                    .get()
                    .getNumber();
        }
        return null;
    }
}
