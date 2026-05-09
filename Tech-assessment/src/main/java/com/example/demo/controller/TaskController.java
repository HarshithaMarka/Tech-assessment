package com.example.demo.controller;

import com.example.demo.dto.TaskDto;
import com.example.demo.entity.Project;
import com.example.demo.entity.Task;
import com.example.demo.entity.User;
import com.example.demo.repository.ProjectRepository;
import com.example.demo.repository.TaskRepository;
import com.example.demo.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tasks")
@CrossOrigin("*")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody TaskDto taskDto) {
        Task task = new Task();
        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setStatus(taskDto.getStatus() != null ? taskDto.getStatus() : "TODO");
        task.setPriority(taskDto.getPriority());
        task.setDueDate(taskDto.getDueDate());

        if (taskDto.getProjectId() != null) {
            Optional<Project> project = projectRepository.findById(taskDto.getProjectId());
            project.ifPresent(task::setProject);
        }

        if (taskDto.getAssigneeId() != null) {
            Optional<User> assignee = userRepository.findById(taskDto.getAssigneeId());
            assignee.ifPresent(task::setAssignee);
        }

        Task savedTask = taskRepository.save(task);
        return ResponseEntity.ok(savedTask);
    }

    @GetMapping
    public List<Task> getTasks() {
        return taskRepository.findAll();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTaskStatus(@PathVariable Long id, @RequestBody TaskDto taskDto) {
        Optional<Task> taskOpt = taskRepository.findById(id);
        if (taskOpt.isPresent()) {
            Task task = taskOpt.get();
            if (taskDto.getStatus() != null) {
                task.setStatus(taskDto.getStatus());
            }
            if (taskDto.getAssigneeId() != null) {
                Optional<User> assignee = userRepository.findById(taskDto.getAssigneeId());
                assignee.ifPresent(task::setAssignee);
            }
            // Add other updatable fields as needed
            taskRepository.save(task);
            return ResponseEntity.ok(task);
        }
        return ResponseEntity.notFound().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskRepository.deleteById(id);
    }
}