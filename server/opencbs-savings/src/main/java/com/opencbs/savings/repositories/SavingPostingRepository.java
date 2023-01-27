package com.opencbs.savings.repositories;

import com.opencbs.savings.domain.SavingPosting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SavingPostingRepository extends JpaRepository<SavingPosting, Long> {

}
