package com.example.demo.api.controller;

import com.example.demo.api.exception.TodoException;
import com.example.demo.api.model.Todo;
import com.example.demo.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:8080")
public class TodoController {

    private final TodoService todoService;

    @Autowired
    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @GetMapping("/todo/all")
    public ResponseEntity<List<Todo>> getAllTodos() {
        List<Todo> todos = todoService.getAllTodos();
        return ResponseEntity.ok(todos);
    }

    @GetMapping(value = "/todos", params = {"page"})
    public ResponseEntity<Page<Todo>> getAllTodosPaginados(
            @RequestParam("page") int page,
            @RequestParam("n") Optional<String> name,
            @RequestParam("p") Optional<String> prio,
            @RequestParam("s") Optional<Boolean> state,
            @RequestParam("sort") Optional<String> sorting,
            @RequestParam("order") Optional<String> sortDirection
    ) {
        Page<Todo> result = todoService.getAllTodosPaginados(page, name, prio, state, sorting, sortDirection);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/todo")
    public ResponseEntity<Todo> getTodo(@RequestParam int id) {
        Optional<Todo> todo = todoService.getTodo(id);
        return todo.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping("/todos")
    public ResponseEntity<Todo> addTodo(@RequestBody Todo newTodo) {
        Todo nTodo = todoService.addTodo(newTodo);
        return ResponseEntity.status(HttpStatus.CREATED).body(nTodo);
    }

    @DeleteMapping("/todos")
    public ResponseEntity<Void> deleteTodo(@RequestParam int id) {
        todoService.deleteTodo(id);
        return ResponseEntity.noContent().build(); 
    }

    @PutMapping("/todos/{id}")
    public ResponseEntity<Todo> editTodo(@PathVariable int id, @RequestBody Todo editTodo) {
        Todo eTodo = todoService.editTodo(id, editTodo);
        return ResponseEntity.ok(eTodo); 
    }

    @PutMapping("/todos/{id}/done")
    public ResponseEntity<Todo> editTodoDone(@PathVariable int id) {
        Todo eTodo = todoService.editTodoDone(id);
        return ResponseEntity.ok(eTodo); 
    }

    @PutMapping("/todos/{id}/undone")
    public ResponseEntity<Todo> editTodoUndone(@PathVariable int id) {
        Todo eTodo = todoService.editTodoUndone(id);
        return ResponseEntity.ok(eTodo); 
    }

    @GetMapping("/todo/metrics")
    public ResponseEntity<Map<String, String>> getTodoMetrics() {
        Map<String, String> todosAverage = todoService.getTodoMetrics();
        return ResponseEntity.ok(todosAverage);
    }
}
