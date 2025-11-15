package com.appbackend.backend.service.category;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.appbackend.backend.entity.Category;
import com.appbackend.backend.entity.Department;
import com.appbackend.backend.entity.Subcategory;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;

public final class CategorySpecification {

    private CategorySpecification() {
    }

    public static Specification<Category> searchByKeyword(String keyword) {
        return (root, query, cb) -> {
            query.distinct(true);

            String searchPattern = "%" + keyword.toLowerCase() + "%";
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(
                    cb.like(
                            cb.lower(cb.coalesce(root.get("name"), "")),
                            searchPattern)
            );

            Join<Category, Department> departmentJoin = root.join("department", JoinType.LEFT);
            predicates.add(
                    cb.like(
                            cb.lower(cb.coalesce(departmentJoin.get("name"), "")),
                            searchPattern)
            );
            predicates.add(
                    cb.like(
                            cb.lower(cb.coalesce(departmentJoin.get("description"), "")),
                            searchPattern)
            );

            Join<Category, Subcategory> subcategoryJoin = root.join("subcategories", JoinType.LEFT);
            predicates.add(
                    cb.like(
                            cb.lower(cb.coalesce(subcategoryJoin.get("name"), "")),
                            searchPattern)
            );

            return cb.or(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<Category> withFilters(Long departmentId, String departmentName) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (departmentId != null) {
                predicates.add(cb.equal(root.join("department", JoinType.LEFT).get("id"), departmentId));
            }

            if (departmentName != null && !departmentName.isBlank()) {
                predicates.add(
                        cb.like(
                                cb.lower(root.join("department", JoinType.LEFT).get("name")),
                                "%" + departmentName.toLowerCase() + "%"
                        )
                );
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

