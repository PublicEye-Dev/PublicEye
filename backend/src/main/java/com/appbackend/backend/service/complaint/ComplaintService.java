package com.appbackend.backend.service.complaint;

import java.io.IOException;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.appbackend.backend.dto.ComplaintDto;
import com.appbackend.backend.dto.PagedResponse;
import com.appbackend.backend.enums.Status;

public interface ComplaintService{
    ComplaintDto createComplaint(String description,
                                 Long categoryId,
                                 Long subcategoryId,
                                 Long userId,
                                 MultipartFile image,
                                 Double latitude,
                                 Double longitude) throws IOException;

    List<ComplaintDto> listComplaints(List<String> statuses, String period);
    ComplaintDto updateStatus(Long id, Status newStatus);
    ComplaintDto upvote(Long id);
    void deleteComplaint(Long id);

    PagedResponse<ComplaintDto> getComplaintsWithFilters(
            Long categoryId,
            Long subcategoryId,
            List<String> statusStrings,
            Pageable pageable);
    List<ComplaintDto> searchComplaints(String keyword);

    ComplaintDto getComplaintById(Long id);
    List<ComplaintDto> getComplaintsByUser(Long userId);
}
