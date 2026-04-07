package com.boattours.tours.service;

import com.boattours.tours.model.Tour;
import com.boattours.tours.repository.TourRepository;
import jakarta.inject.Singleton;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Singleton
public class TourService {

    private final TourRepository tourRepository;

    public TourService(TourRepository tourRepository) {
        this.tourRepository = tourRepository;
    }

    public List<Tour> listAll() {
        List<Tour> list = new ArrayList<>();
        tourRepository.findAll().forEach(list::add);
        return list;
    }

    public Tour create(String name, String location, BigDecimal price) {
        Tour tour = new Tour();
        tour.setName(name.trim());
        tour.setLocation(location.trim());
        tour.setPrice(price);
        return tourRepository.save(tour);
    }
}
