package com.opencbs.bonds.services.repayment;

import com.opencbs.bonds.domain.Bond;
import com.opencbs.bonds.domain.BondInstallment;
import com.opencbs.core.domain.RepaymentSplit;
import com.opencbs.core.domain.RepaymentTypes;
import com.opencbs.core.domain.User;

import java.util.List;

public interface BondRepaymentService {

    RepaymentSplit split(Bond bond, RepaymentSplit repaymentSplit, User currentUser);

    List<BondInstallment> preview(Bond bond, RepaymentSplit repaymentSplit, User currentUser) throws Exception;

    void repay(Bond bond, RepaymentSplit repaymentSplit, User currentUser) throws Exception ;

    RepaymentTypes getType();
}
