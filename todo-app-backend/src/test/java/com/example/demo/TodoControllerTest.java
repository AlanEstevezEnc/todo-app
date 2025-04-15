package com.example.demo;

import com.example.demo.api.controller.TodoController;
import com.example.demo.api.model.Todo;
import com.example.demo.service.TodoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TodoController.class)
class TodoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TodoService todoService;

    @Test
    void testGetTodoById() throws Exception {
        //User mockUser = new User(1L, "John Doe", "john@example.com");
        Todo mockTodo = new Todo(1,"Tarea 1","Medium",2025,3,5);
        //Mockito.when(todoService.getUserById(1L)).thenReturn(mockUser);
        Mockito.when( todoService.getTodo(1)).thenReturn(Optional.of(mockTodo));


        mockMvc.perform(MockMvcRequestBuilders.get("/todo")
                        .param("id", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.taskName").value("Tarea 1"))
                .andExpect(jsonPath("$.priority").value("Medium"));
    }

    @Test
    void testGetTodosPaginados() throws Exception {

        Todo mockTodo = new Todo(1,"Task 1","Medium",2025,3,5);
        Todo mockTodo2 = new Todo(2,"Task 2","High",2026,5,5);

        List<Todo> todoList;

        todoList = new ArrayList<>();
        todoList.addAll( Arrays.asList(mockTodo,mockTodo2));

        Pageable pageable = PageRequest.of(0, 10);
        PageImpl<Todo> mockPage = new PageImpl<>(todoList, pageable, todoList.size());

        Mockito.when( todoService.getAllTodosPaginados(0, Optional.empty(), Optional.empty(),
                Optional.empty() ,Optional.empty() ,Optional.empty())).thenReturn(mockPage);


        mockMvc.perform(MockMvcRequestBuilders.get("/todos")
                        .param("page", "0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].taskName").value("Task 1"))
                .andExpect(jsonPath("$.content[0].priority").value("Medium"))
                .andExpect(jsonPath("$.content[1].id").value(2))
                .andExpect(jsonPath("$.content[1].taskName").value("Task 2"))
                .andExpect(jsonPath("$.content[1].priority").value("High"));
    }

    @Test
    void testAddTodo() throws Exception {
        //User mockUser = new User(1L, "John Doe", "john@example.com");
        Todo mockTodo = new Todo(1,"Task 1","Medium",2025,3,5);
        //Mockito.when(todoService.getUserById(1L)).thenReturn(mockUser);
        Mockito.when( todoService.addTodo(Mockito.any(Todo.class))).thenReturn( mockTodo );

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        String json = objectMapper.writeValueAsString(mockTodo);

        mockMvc.perform(MockMvcRequestBuilders.post("/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.taskName").value("Task 1"))
                .andExpect(jsonPath("$.priority").value("Medium"));
    }

    @Test
    void testEditTodo() throws Exception {
        //User mockUser = new User(1L, "John Doe", "john@example.com");
        Todo mockTodo = new Todo(1,"Task 1","Medium",2025,3,5);
        //Mockito.when(todoService.getUserById(1L)).thenReturn(mockUser);
        Mockito.when( todoService.addTodo(Mockito.any(Todo.class))).thenReturn( mockTodo );

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        String json = objectMapper.writeValueAsString(mockTodo);

        mockMvc.perform(MockMvcRequestBuilders.post("/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.taskName").value("Task 1"))
                .andExpect(jsonPath("$.priority").value("Medium"));
    }


}

