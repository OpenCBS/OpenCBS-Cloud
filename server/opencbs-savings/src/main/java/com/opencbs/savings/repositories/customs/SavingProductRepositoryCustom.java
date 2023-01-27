package com.opencbs.savings.repositories.customs;

import com.opencbs.core.domain.enums.StatusType;
import com.opencbs.savings.domain.SavingProduct;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SavingProductRepositoryCustom {

    Page<SavingProduct> searchByStringAndStatus(String searchString, List<StatusType> statusTypes, Pageable pageable);

}
