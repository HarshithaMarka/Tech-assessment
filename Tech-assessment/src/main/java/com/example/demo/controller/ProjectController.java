package com.example.demo.controller;

import com.example.demo.entity.Project;
import com.example.demo.entity.User;
import com.example.demo.repository.ProjectRepository;
import com.example.demo.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/projects")
@CrossOrigin("*")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> createProject(@RequestBody Project project) {
        String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> ownerOpt = userRepository.findByEmail(currentUserEmail);

        if (ownerOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        project.setOwner(ownerOpt.get());
        Project savedProject = projectRepository.save(project);
        return ResponseEntity.ok(savedProject);
    }

    @GetMapping
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProjectById(@PathVariable Long id) {
        Optional<Project> project = projectRepository.findById(id);
        if (project.isPresent()) {
            return ResponseEntity.ok(project.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        if (projectRepository.existsById(id)) {
            projectRepository.deleteById(id);
            return ResponseEntity.ok("Project deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }
}