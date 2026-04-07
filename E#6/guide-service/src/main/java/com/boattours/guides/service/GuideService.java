package com.boattours.guides.service;

import com.boattours.guides.model.Guide;
import com.boattours.guides.repository.GuideRepository;
import jakarta.inject.Singleton;

import java.util.ArrayList;
import java.util.List;

@Singleton
public class GuideService {

    private final GuideRepository guideRepository;

    public GuideService(GuideRepository guideRepository) {
        this.guideRepository = guideRepository;
    }

    public List<Guide> listAll() {
        List<Guide> list = new ArrayList<>();
        guideRepository.findAll().forEach(list::add);
        return list;
    }

    public Guide register(String displayName, String contactPhone, String homeLocation) {
        Guide guide = new Guide();
        guide.setDisplayName(displayName.trim());
        guide.setContactPhone(contactPhone != null ? contactPhone.trim() : null);
        guide.setHomeLocation(homeLocation != null ? homeLocation.trim() : null);
        return guideRepository.save(guide);
    }
}
