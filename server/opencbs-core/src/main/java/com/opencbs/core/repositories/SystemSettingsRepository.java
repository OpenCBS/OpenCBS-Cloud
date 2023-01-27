package com.opencbs.core.repositories;

import com.opencbs.core.domain.SystemSettings;
import com.opencbs.core.domain.enums.SystemSettingsName;

public interface SystemSettingsRepository extends Repository<SystemSettings> {

    SystemSettings findByName(SystemSettingsName name);

}
