package com.example.demo.api.controller;


import com.example.demo.api.exception.TodoException;
import com.example.demo.api.model.Todo;
import com.example.demo.service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:8080")
public class TodoController {

    private TodoService todoService;

    @Autowired
    public TodoController(TodoService todoService){
        this.todoService = todoService;

    }

    @GetMapping("/todo/all")
    public List<Todo> getAllTodos(){
        List<Todo> todo = todoService.getAllTodos();
        return todo;

    }

    @GetMapping(value = "/todos",params = {"page"})
    public PageImpl<Todo> getAllTodosPaginados(@RequestParam("page") int page, @RequestParam("n") Optional<String> name,
                                               @RequestParam("p") Optional<String> prio,@RequestParam("s") Optional<Boolean> state
    ,@RequestParam("sort") Optional<String> sorting, @RequestParam("order")Optional<String> sortDirection){



        return todoService.getAllTodosPaginados(page,name,prio,state,sorting,sortDirection);


    }

    @GetMapping("/todo")
    public Todo getTodo(@RequestParam int id){
        Optional<Todo> todo = todoService.getTodo(id);
        if(todo.isPresent()){
            return (Todo) todo.get();
        }
        return null;
    }

    @PostMapping("/todos")
    public ResponseEntity<Object> addTodo(@RequestBody Todo newTodo){
        try{
            Todo nTodo = todoService.addTodo(newTodo);
            return new ResponseEntity<>(nTodo, HttpStatus.CREATED);
        } catch (TodoException e) {
            throw e;
        }
    }

    @DeleteMapping("/todos")
    public ResponseEntity<Object> deleteTodo(@RequestParam int id){
        try{
            String res = todoService.deleteTodo(id);
            return new ResponseEntity<>(res, HttpStatus.CREATED);
        } catch (TodoException e) {
            throw e;
        }
    }

    @PutMapping("/todos/{id}")
    public ResponseEntity<Object> editTodo(@PathVariable int id,@RequestBody Todo editTodo){
        try{
            Todo eTodo = todoService.editTodo(id,editTodo);
            return new ResponseEntity<>(eTodo, HttpStatus.ACCEPTED);
        }catch (TodoException e){
            throw e;
        }
    }

    @PutMapping("/todos/{id}/done")
    public ResponseEntity<Object> editTodoDone(@PathVariable int id){
        try{
            Todo eTodo = todoService.editTodoDone(id);
            return new ResponseEntity<>(eTodo, HttpStatus.ACCEPTED);
        }catch (TodoException e){
            throw e;
        }
    }

    @PutMapping("/todos/{id}/undone")
    public ResponseEntity<Object> editTodoUndone(@PathVariable int id){
        try{
            Todo eTodo = todoService.editTodoUndone(id);
            return new ResponseEntity<>(eTodo, HttpStatus.ACCEPTED);
        }catch (TodoException e){
            throw e;
        }
    }

    @GetMapping("/todo/metrics")
    public ResponseEntity<Object> getTodoMetrics(){
        Map<String,String> todosAverage = todoService.getTodoMetrics();
        return new ResponseEntity<>(todosAverage, HttpStatus.ACCEPTED);

    }

}
