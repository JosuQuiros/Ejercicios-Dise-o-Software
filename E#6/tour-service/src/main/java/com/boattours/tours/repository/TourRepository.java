package com.boattours.tours.repository;

import com.boattours.tours.model.Tour;
import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.CrudRepository;

@JdbcRepository(dialect = Dialect.H2)
public interface TourRepository extends CrudRepository<Tour, Long> {
}
