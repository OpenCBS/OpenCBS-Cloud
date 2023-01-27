package com.opencbs.borrowings.services.impl;

import com.opencbs.borrowings.domain.schedule.BorrowingInstallmentInterestAccrual;
import com.opencbs.borrowings.repositories.BorrowingInstallmentInterestAccrualRepository;
import com.opencbs.borrowings.services.BorrowingInstallmentInterestAccrualService;
import com.opencbs.core.helpers.DateHelper;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static java.util.stream.Collectors.groupingBy;

@Service
@RequiredArgsConstructor
public class BorrowingInstallmentInterestAccrualServiceImpl implements BorrowingInstallmentInterestAccrualService {

    private final BorrowingInstallmentInterestAccrualRepository repository;


    @Override
    public BorrowingInstallmentInterestAccrual getCurrentInstallment(@NonNull Long borrowingId, @NonNull LocalDateTime currentDateTime) {
        List<BorrowingInstallmentInterestAccrual> installments = getBorrowingInstallments(borrowingId, currentDateTime);
        return getCurrentInstallment(installments, currentDateTime);
    }

    private List<BorrowingInstallmentInterestAccrual> getBorrowingInstallments(@NonNull Long borrowingId, LocalDateTime datcurrentDateTimeTime) {
        List<BorrowingInstallmentInterestAccrual> installments = repository.findByBorrowingIdAndAndDeletedIsTrueAndEffectiveAtIsLessThanEqual(borrowingId, datcurrentDateTimeTime);
        Map<Integer, List<BorrowingInstallmentInterestAccrual>> groupedInstallments = installments.stream()
                .collect(groupingBy(BorrowingInstallmentInterestAccrual::getNumber));

        List<BorrowingInstallmentInterestAccrual> result = new ArrayList<>();
        for (Map.Entry<Integer, List<BorrowingInstallmentInterestAccrual>> entry : groupedInstallments.entrySet()) {
            result.add(entry
                    .getValue().stream()
                    .max(Comparator.comparing(BorrowingInstallmentInterestAccrual::getEventGroupKey))
                    .orElseThrow(() -> new RuntimeException("No installments found for event group key")));
        }

        return result;
    }

    private BorrowingInstallmentInterestAccrual getCurrentInstallment(@NonNull List<BorrowingInstallmentInterestAccrual> installments, @NonNull LocalDateTime currentDateTime) {
        Optional<BorrowingInstallmentInterestAccrual> resultInstallment = installments.stream()
                .filter(x -> DateHelper.greaterOrEqual(x.getMaturityDate(), currentDateTime.toLocalDate()))
                .min(Comparator.comparing(BorrowingInstallmentInterestAccrual::getMaturityDate));

        return resultInstallment.orElseGet(() -> installments.stream()
                .filter(x -> DateHelper.lessOrEqual(x.getMaturityDate(), currentDateTime.toLocalDate()))
                .max(Comparator.comparing(BorrowingInstallmentInterestAccrual::getMaturityDate))
                .orElse(null));
    }
}
