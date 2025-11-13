package com.appbackend.backend.service.complaint;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.appbackend.backend.entity.Complaint;
import com.appbackend.backend.enums.Status;

import jakarta.persistence.criteria.Predicate;

public class ComplaintSpecification {

    public static Specification<Complaint> withFilters(
            Long categoryId,
            Long subcategoryId,
            List<Status> statuses) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }

            if (subcategoryId != null) {
                predicates.add(cb.equal(root.get("subcategory").get("id"), subcategoryId));
            }

            if (statuses != null && !statuses.isEmpty()) {
                predicates.add(root.get("status").in(statuses));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<Complaint> searchByKeyword(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return (root, query, cb) -> cb.conjunction();
        }

        String searchPattern = "%" + keyword.toLowerCase() + "%";

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Căutare în description
            predicates.add(cb.like(cb.lower(root.get("description")), searchPattern));

            // Căutare în status (enum stocat ca STRING în DB)
            // Verificăm dacă keyword-ul se potrivește cu numele statusului
            List<Status> matchingStatuses = new ArrayList<>();
            for (Status status : Status.values()) {
                if (status.name().toLowerCase().contains(keyword.toLowerCase())) {
                    matchingStatuses.add(status);
                }
            }
            if (!matchingStatuses.isEmpty()) {
                predicates.add(root.get("status").in(matchingStatuses));
            }

            // Căutare în category.name
            predicates.add(cb.like(cb.lower(root.get("category").get("name")), searchPattern));

            // Căutare în subcategory.name
            predicates.add(cb.like(cb.lower(root.get("subcategory").get("name")), searchPattern));

            // Căutare în user.fullName
            predicates.add(cb.like(cb.lower(root.get("user").get("fullName")), searchPattern));

            // Căutare în user.email
            predicates.add(cb.like(cb.lower(root.get("user").get("email")), searchPattern));

            // Căutare în user.phoneNumber
            predicates.add(cb.like(cb.lower(root.get("user").get("phoneNumber")), searchPattern));

            // Returnăm OR între toate predicate-urile (match în oricare câmp)
            return cb.or(predicates.toArray(new Predicate[0]));
        };
    }
}