package com.boattours.guides.repository;

import com.boattours.guides.model.Guide;
import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.CrudRepository;

@JdbcRepository(dialect = Dialect.H2)
public interface GuideRepository extends CrudRepository<Guide, Long> {
}
