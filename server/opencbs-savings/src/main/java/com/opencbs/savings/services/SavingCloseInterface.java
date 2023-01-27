package com.opencbs.savings.services;

import com.opencbs.savings.domain.Saving;

import java.time.LocalDate;

public interface SavingCloseInterface {

    Saving close (Saving saving, LocalDate closeDate);
}
