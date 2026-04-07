package com.boattours.tours.controller;

import com.boattours.tours.controller.dto.CreateTourRequest;
import com.boattours.tours.model.Tour;
import com.boattours.tours.service.TourService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Post;
import io.micronaut.validation.Validated;
import jakarta.validation.Valid;

import java.util.List;

@Controller("/tours")
@Validated
public class TourController {

    private final TourService tourService;

    public TourController(TourService tourService) {
        this.tourService = tourService;
    }

    @Get
    public List<Tour> list() {
        return tourService.listAll();
    }

    @Post
    public HttpResponse<Tour> create(@Body @Valid CreateTourRequest request) {
        Tour created = tourService.create(request.getName(), request.getLocation(), request.getPrice());
        return HttpResponse.created(created);
    }
}
