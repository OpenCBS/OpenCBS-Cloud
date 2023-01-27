package com.opencbs.core.request.repository;

import com.opencbs.core.domain.User;
import com.opencbs.core.repositories.Repository;
import com.opencbs.core.request.domain.ActionRequest;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface ActionRequestRepository extends Repository<ActionRequest> {

    @Query("select ar from ActionRequest ar where (ar.actionAt between ?2 and ?3) and (ar.approvedBy = ?1 or ?1 is null)")
    List<ActionRequest> getByApprovedIdsByUserAndDates(User user, LocalDateTime fromDate, LocalDateTime toDate);
}
