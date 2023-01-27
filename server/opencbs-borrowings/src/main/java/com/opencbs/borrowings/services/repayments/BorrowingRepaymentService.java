package com.opencbs.borrowings.services.repayments;

import com.opencbs.borrowings.domain.Borrowing;
import com.opencbs.borrowings.domain.schedule.BorrowingInstallment;
import com.opencbs.core.domain.RepaymentSplit;
import com.opencbs.core.domain.User;

import java.util.List;

public interface BorrowingRepaymentService {
    RepaymentSplit split(Borrowing borrowing, RepaymentSplit repaymentSplit, User currentUser);
    List<BorrowingInstallment> preview(Borrowing borrowing, RepaymentSplit repaymentSplit, User currentUser) throws Exception;
    void repay(Borrowing borrowing, RepaymentSplit repaymentSplit, User currentUser) throws Exception ;
}
