package com.appbackend.backend.service.petition;

import java.time.LocalDateTime;

import org.springframework.data.jpa.domain.Specification;

import com.appbackend.backend.entity.Petition;
import com.appbackend.backend.enums.PetitionStatus;

public final class PetitionSpecification {
    private PetitionSpecification() {}

    public static Specification<Petition> withFilters(
            PetitionStatus status,
            LocalDateTime createdAfter,
            LocalDateTime createdBefore
    ) {
        Specification<Petition> spec = (root, query, cb) -> cb.conjunction();

        if (status != null) {
            spec = spec.and(hasStatus(status));
        }
        if (createdAfter != null) {
            spec = spec.and(createdAfter(createdAfter));
        }
        if (createdBefore != null) {
            spec = spec.and(createdBefore(createdBefore));
        }

        return spec;
    }

    private static Specification<Petition> hasStatus(PetitionStatus status) {
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }

    private static Specification<Petition> createdAfter(LocalDateTime createdAfter) {
        return (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("createdAt"), createdAfter);
    }

    private static Specification<Petition> createdBefore(LocalDateTime createdBefore) {
        return (root, query, cb) -> cb.lessThanOrEqualTo(root.get("createdAt"), createdBefore);
    }
}

