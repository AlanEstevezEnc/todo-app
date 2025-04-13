package com.example.demo.api.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class Todo {

    private int id;


    private String taskName;
    private String priority;
    private boolean todoState;

    private LocalDate dueDate;
    private LocalDateTime creationDate;
    private LocalDateTime completionDate;

    public Todo(){
    }

    public Todo(int id, String taskName, String priority, int year, int month, int day){
        this.id = id;
        this.taskName = taskName;
        this.priority = priority;

        this.dueDate = LocalDate.of(year,month,day);
        this.creationDate = LocalDateTime.now();

    }


    public Todo(int id, String taskName, String priority){
        this.id = id;
        this.taskName = taskName;
        this.priority = priority;
        this.dueDate = null;
        this.creationDate = LocalDateTime.now();

        this.todoState = false;


    }


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public boolean isTodoState() {
        return todoState;
    }

    public void setTodoState(boolean todoState) {
        this.todoState = todoState;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDateTime creationDate) {
        this.creationDate = creationDate;
    }

    public LocalDateTime getCompletionDate() {
        return completionDate;
    }

    public void setCompletionDate(LocalDateTime completionDate) {
        this.completionDate = completionDate;
    }
}
