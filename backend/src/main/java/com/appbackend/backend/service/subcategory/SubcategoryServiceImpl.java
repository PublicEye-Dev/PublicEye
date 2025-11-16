package com.appbackend.backend.service.subcategory;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.appbackend.backend.dto.PagedResponse;
import com.appbackend.backend.dto.SubcategoryCreateRequest;
import com.appbackend.backend.dto.SubcategoryResponse;
import com.appbackend.backend.entity.Category;
import com.appbackend.backend.entity.Subcategory;
import com.appbackend.backend.repository.CategoryRepository;
import com.appbackend.backend.repository.SubcategoryRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class SubcategoryServiceImpl implements SubcategoryService {
    private final SubcategoryRepository subcategoryRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public PagedResponse<SubcategoryResponse> getAllSubcategories(int page, int size, Long categoryId, String categoryName) {
        int validatedPage = Math.max(page, 0);
        int validatedSize = size <= 0 ? 10 : Math.min(size, 100);

        Pageable pageable = PageRequest.of(validatedPage, validatedSize, Sort.by("name").ascending());

        if (categoryId != null && !categoryRepository.existsById(categoryId)) {
            throw new EntityNotFoundException("Categoria nu a fost gasita");
        }

        Specification<Subcategory> specification = SubcategorySpecification.withCategoryFilters(categoryId, categoryName);
        Page<Subcategory> subcategoryPage = subcategoryRepository.findAll(specification, pageable);

        List<SubcategoryResponse> content = subcategoryPage.getContent()
                .stream()
                .map(SubcategoryResponse::from)
                .toList();

        return new PagedResponse<>(
                content,
                subcategoryPage.getNumber(),
                subcategoryPage.getSize(),
                subcategoryPage.getTotalElements(),
                subcategoryPage.getTotalPages(),
                subcategoryPage.isFirst(),
                subcategoryPage.isLast()
        );
    }

    @Override
    public List<SubcategoryResponse> getAllSubcategoriesList(Long categoryId) {
        if (categoryId == null) {
            throw new IllegalArgumentException("Id-ul categoriei este obligatoriu");
        }

        if (!categoryRepository.existsById(categoryId)) {
            throw new EntityNotFoundException("Categoria nu a fost gasita");
        }

        return subcategoryRepository.findAllByCategoryId(categoryId)
                .stream()
                .map(SubcategoryResponse::from)
                .toList();
    }

    @Override
    public Subcategory getSubcategoryById(Long id) {
        return subcategoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Subcategoria nu a fost gasita"));
    }

    @Override
    public Subcategory addSubcategory(SubcategoryCreateRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new EntityNotFoundException("Categoria nu a fost gasita"));
        Subcategory subcategory = new Subcategory();
        subcategory.setCategory(category);
        subcategory.setName(request.name());
        subcategoryRepository.save(subcategory);
        return subcategory;
    }

    @Override
    public Subcategory updateSubcategory(Long id, SubcategoryCreateRequest request) {
        Subcategory subcategory = subcategoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Subcategoria nu a fost gasita"));
        String requestedName = request.name();
        if (!subcategory.getName().equals(requestedName)) {
            subcategory.setName(requestedName);
        }
        Category category = subcategory.getCategory();
        Long requestedCategoryId = request.categoryId();
        if(!requestedCategoryId.equals(category.getId())) {
            category = categoryRepository.findById(requestedCategoryId)
                    .orElseThrow(() -> new EntityNotFoundException("Categoria nu a fost gasita"));
        }
        subcategory.setCategory(category);
        subcategoryRepository.save(subcategory);
        return subcategory;
    }

    @Override
    public void deleteSubcategory(Long id) {
        Subcategory subcategory = subcategoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Subcategoria nu a fost gasita"));
        subcategoryRepository.delete(subcategory);
    }

    @Override
    public List<Subcategory> getSubcategoriesByCategoryId(Long id) {
        return subcategoryRepository.findAllByCategoryId(id);
    }

    @Override
    public List<SubcategoryResponse> getAvailableSubcategories(Long categoryId) {
        List<Subcategory> available = subcategoryRepository.findAvailableSubcategories(categoryId);
        return available.stream()
                .map(SubcategoryResponse::from)
                .toList();
    }
}
