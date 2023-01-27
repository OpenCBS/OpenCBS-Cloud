package com.opencbs.core.repositories;

import com.opencbs.core.domain.GlobalSettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GlobalSettingsRepository  extends JpaRepository<GlobalSettings, String> {
}
