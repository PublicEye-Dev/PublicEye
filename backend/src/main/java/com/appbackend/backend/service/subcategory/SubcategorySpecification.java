package com.appbackend.backend.service.subcategory;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.appbackend.backend.entity.Category;
import com.appbackend.backend.entity.Subcategory;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;

public final class SubcategorySpecification {

    private SubcategorySpecification() {
    }

    public static Specification<Subcategory> withCategoryFilters(Long categoryId, String categoryName) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            Join<Subcategory, Category> categoryJoin = root.join("category", JoinType.INNER);

            if (categoryId != null) {
                predicates.add(cb.equal(categoryJoin.get("id"), categoryId));
            }

            if (categoryName != null && !categoryName.isBlank()) {
                predicates.add(
                        cb.like(
                                cb.lower(categoryJoin.get("name")),
                                "%" + categoryName.toLowerCase() + "%"
                        )
                );
            }

            if (predicates.isEmpty()) {
                return cb.conjunction();
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

