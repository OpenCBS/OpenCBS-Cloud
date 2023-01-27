package com.opencbs.core.repositories.implementations;

import com.opencbs.core.domain.profiles.Person;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.EntityManager;

public class PersonRepositoryImpl extends ProfileBaseRepositoryImpl<Person> {
    @Autowired
    PersonRepositoryImpl(EntityManager entityManager) {
        super(entityManager, Person.class);
    }
}

