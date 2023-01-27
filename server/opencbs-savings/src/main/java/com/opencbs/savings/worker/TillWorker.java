package com.opencbs.savings.worker;

import com.opencbs.core.domain.User;
import com.opencbs.savings.dto.OperationSavingDto;
import lombok.NonNull;

public interface TillWorker {

    Long depositToSaving(@NonNull Long tillId, @NonNull OperationSavingDto dto);

    Long withdrawFromSaving(@NonNull Long tillId, @NonNull OperationSavingDto dto, User currentUser);
}
