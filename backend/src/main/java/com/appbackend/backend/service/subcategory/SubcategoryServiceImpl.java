package com.appbackend.backend.service.subcategory;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
    public PagedResponse<SubcategoryResponse> getAllSubcategories(int page, int size, Long categoryId) {
        if (page < 0) {
            throw new IllegalArgumentException("Pagina trebuie sa fie pozitiva");
        }
        if (size <= 0 || size > 100) {
            throw new IllegalArgumentException("Dimensiunea trebuie sa fie intre 1 si 100");
        }
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        Page<Subcategory> subcategoryPage;
        if (categoryId != null) {
            if (!categoryRepository.existsById(categoryId)) {
                throw new EntityNotFoundException("Categoria nu a fost gasita");
            }
            subcategoryPage = subcategoryRepository.findAllByCategory_Id(categoryId, pageable);
        } else {
            subcategoryPage = subcategoryRepository.findAll(pageable);
        }
        List<SubcategoryResponse> content = subcategoryPage.getContent()
                .stream()
                .map(SubcategoryResponse::from)
                .toList();
        return PagedResponse.of(
                content,
                subcategoryPage.getNumber(),
                subcategoryPage.getSize(),
                subcategoryPage.getTotalElements()
        );
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
        if(request.name() != null) {
            subcategory.setName(request.name());
        }
        Category category = subcategory.getCategory();
        if(request.categoryId() != null && !request.categoryId().equals(category.getId())) {
            category = categoryRepository.findById(request.categoryId())
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
}
