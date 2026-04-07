package com.boattours.guides.controller;

import com.boattours.guides.controller.dto.RegisterGuideRequest;
import com.boattours.guides.model.Guide;
import com.boattours.guides.service.GuideService;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Post;
import io.micronaut.validation.Validated;
import jakarta.validation.Valid;

import java.util.List;

@Controller("/guides")
@Validated
public class GuideController {

    private final GuideService guideService;

    public GuideController(GuideService guideService) {
        this.guideService = guideService;
    }

    @Get
    public List<Guide> list() {
        return guideService.listAll();
    }

    @Post
    public HttpResponse<Guide> register(@Body @Valid RegisterGuideRequest request) {
        Guide created = guideService.register(
                request.getDisplayName(),
                request.getContactPhone(),
                request.getHomeLocation()
        );
        return HttpResponse.created(created);
    }
}
