package com.opencbs.core.repositories;

import com.opencbs.core.domain.BaseEntity;
import com.querydsl.core.types.dsl.EntityPathBase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;
import org.springframework.data.querydsl.binding.QuerydslBinderCustomizer;
import org.springframework.data.querydsl.binding.QuerydslBindings;
import org.springframework.data.repository.NoRepositoryBean;


@NoRepositoryBean
public interface ExQBuilderRepository<T extends BaseEntity, P extends EntityPathBase<T>>
        extends JpaRepository<T, Long>, QueryDslPredicateExecutor<T>, QuerydslBinderCustomizer<P> {

    @Override
    default void customize(QuerydslBindings bindings, P root) {
    }
}