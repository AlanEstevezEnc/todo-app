package com.example.demo.service;

import com.example.demo.api.exception.TodoException;
import com.example.demo.api.model.Todo;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TodoService {


    private List<Todo> todoList;
    int lowCount = 0;
    int mediumCount = 0;
    int highCount = 0;
    int doneCount = 0;

    //Minutes average
    long lowAverage = 0;
    long midAverage = 0;
    long highAverage = 0;
    private int idCount = 0;

    public TodoService() {
        todoList = new ArrayList<>();
        

        if(!todoList.isEmpty()){
            idCount = todoList.toArray().length+1;
        }



    }

    public List<Todo> getAllTodos(){
        return todoList;
    }

    public PageImpl<Todo> getAllTodosPaginados(int page,Optional<String> name
            ,Optional<String> prio,Optional<Boolean> state ,Optional<String> sorting,Optional<String> sortDirection){

        List<Todo> formatList = todoList;

        if (name.isPresent()) {
            formatList = formatList.stream()
                    .filter(todo -> todo.getTaskName().toLowerCase().contains(name.get().toLowerCase()))
                    .collect(Collectors.toList());
        }

        if (prio.isPresent()) {
            formatList = formatList.stream()
                    .filter(todo -> todo.getPriority().toLowerCase().contains(prio.get().toLowerCase()))
                    .collect(Collectors.toList());
        }

        if (state.isPresent()) {
            formatList = formatList.stream()
                    .filter(todo -> todo.isTodoState() == state.get())
                    .collect(Collectors.toList());
        }

        if (sorting.isPresent()) {
            String sortOption = sorting.get().toLowerCase();
            String direction = sortDirection.orElse("asc").toLowerCase();

            Comparator<Todo> comparator = null;

            if (sortOption.contains("date")) {
                Comparator<Todo> dateComparator = Comparator.comparing(
                        Todo::getDueDate,
                        Comparator.nullsLast(Comparator.naturalOrder())
                );

                if (direction.equals("desc")) {
                    dateComparator = dateComparator.reversed();
                }

                comparator = dateComparator;
            }

            if (sortOption.contains("prio")) {
                Comparator<Todo> prioComparator = Comparator.comparing(todo -> {
                    switch (todo.getPriority().toLowerCase()) {
                        case "high": return 0;
                        case "medium": return 1;
                        case "low": return 2;
                        default: return 3;
                    }
                });

                if (direction.equals("desc")) {
                    prioComparator = prioComparator.reversed();
                }

                if (comparator != null) {
                    comparator = comparator.thenComparing(prioComparator);
                } else {
                    comparator = prioComparator;
                }
            }

            if (comparator != null) {
                formatList = formatList.stream()
                        .sorted(comparator)
                        .collect(Collectors.toList());
            }
        }

        int fromI = page * 10;
        int toI = Math.min(fromI + 10, formatList.size());

        List<Todo> paginatedList = formatList.subList(fromI,toI);
        Pageable p = PageRequest.of(page,10);

        return new PageImpl<>(paginatedList,p,formatList.size());
    }

    public Optional<Todo> getTodo(int id) {

        Optional opt = Optional.empty();

        for(Todo todoSearch : todoList){
            if(id == todoSearch.getId()){
                opt = Optional.of(todoSearch);
                return opt;
            }
        }
        return opt;
    }

    public Todo addTodo(Todo newTodo) {

        if(newTodo.getTaskName() == null || newTodo.getTaskName().isEmpty()){
            throw new TodoException("Task name can not be empty");
        }

        if(newTodo.getTaskName().length() > 120){
            throw new TodoException("Task name can not be longer than 120 characters");
        }

        newTodo.setId(idCount++);
        newTodo.setCreationDate(LocalDateTime.now());


        todoList.add(newTodo);

        return newTodo;
    }

    public Todo editTodo(int id,Todo newTodo) {


        Todo todoEditable = null;

        for(Todo t: todoList){
            if(t.getId() == id){
                todoEditable = t;
                break;
            }
        }
        if (todoEditable == null){
            throw new TodoException("Given task does not exist");
        }

        String taskName = newTodo.getTaskName();
        String prio = newTodo.getPriority();
        LocalDate date = newTodo.getDueDate();


        if(taskName == null || taskName.isEmpty()){
            throw new TodoException("Task name can not be empty");
        } else if (newTodo.getTaskName().length() > 120) {
            throw new TodoException("Task name can not be longer than 120 characters");
        }else {
            todoEditable.setTaskName(taskName);
        }


        if(todoEditable.isTodoState()){

            Duration timeBetween = Duration.between(todoEditable.getCreationDate(),todoEditable.getCompletionDate());
            long minBetween = timeBetween.toMinutes();

            switch (todoEditable.getPriority()){
                case("High"):
                    highCount-=1;
                    highAverage -= minBetween;
                    break;

                case("Medium"):
                    mediumCount-=1;
                    midAverage -= minBetween;
                    break;

                case("Low"):
                    lowCount-=1;
                    lowAverage -= minBetween;
                    break;
            }

        }





        if (prio != null && !prio.isEmpty() && !prio.equals(todoEditable.getPriority())){
            todoEditable.setPriority(prio);

            if(todoEditable.isTodoState()){

                Duration timeBetween = Duration.between(todoEditable.getCreationDate(),todoEditable.getCompletionDate());
                long minBetween = timeBetween.toMinutes();

                switch (prio){
                    case("Low"):
                        lowCount+=1;
                        lowAverage+= minBetween;
                        break;
                    case("Medium"):
                        mediumCount+=1;
                        midAverage+= minBetween;
                        break;
                    case("High"):
                        highCount+=1;
                        highAverage+= minBetween;
                        break;
                }
            }


        }


        if(date == null){
            todoEditable.setDueDate(null);
        } else {
            try{
                todoEditable.setDueDate(date);
            } catch (TodoException e) {
                throw new TodoException("Date format is wrong");
            }
        }


        return todoEditable;
    }

    public Todo editTodoDone(int id) {


        Todo todoEditable = null;
        for(Todo t: todoList){
            if(t.getId() == id){
                todoEditable = t;
                break;
            }
        }
        if (todoEditable == null){
            throw new TodoException("Given task does not exist");
        }
        if(!todoEditable.isTodoState()) {
            todoEditable.setTodoState(true);
            todoEditable.setCompletionDate(LocalDateTime.now());

            Duration timeBetween = Duration.between(todoEditable.getCreationDate(),todoEditable.getCompletionDate());
            long minBetween = timeBetween.toMinutes();

            switch (todoEditable.getPriority()){
                case("High"):
                    highCount+=1;
                    highAverage += minBetween;
                    break;

                case("Medium"):
                    mediumCount+=1;
                    midAverage += minBetween;
                    break;

                case("Low"):
                    lowCount+=1;
                    lowAverage += minBetween;
                    break;
            }
            doneCount++;

        }


        return todoEditable;
    }

    public Todo editTodoUndone(int id) {


        Todo todoEditable = null;
        for(Todo t: todoList){
            if(t.getId() == id){
                todoEditable = t;
                break;
            }
        }
        if (todoEditable == null){
            throw new TodoException("Given task does not exist");
        }
        if(todoEditable.isTodoState()) {
            todoEditable.setTodoState(false);


            Duration timeBetween = Duration.between(todoEditable.getCreationDate(),todoEditable.getCompletionDate());
            long minBetween = timeBetween.toMinutes();

            switch (todoEditable.getPriority()){
                case("High"):
                    highCount-=1;
                    highAverage -= minBetween;
                    break;

                case("Medium"):
                    mediumCount-=1;
                    midAverage -= minBetween;
                    break;

                case("Low"):
                    lowCount-=1;
                    lowAverage -= minBetween;
                    break;
            }
            doneCount--;

        }
        todoEditable.setCompletionDate(null);

        return todoEditable;
    }

    public String deleteTodo(int id) {
        Todo todoDelete = null;
        try{
            for(Todo t: todoList){
                if(t.getId() == id){
                    todoDelete = t;
                    break;
                }
            }

            if (todoDelete.isTodoState()) {

            Duration timeBetween = Duration.between(todoDelete.getCreationDate(),todoDelete.getCompletionDate());
            long minBetween = timeBetween.toMinutes();

                switch (todoDelete.getPriority()){
                    case("High"):
                        highCount-=1;
                        highAverage -= minBetween;
                        break;

                    case("Medium"):
                        mediumCount-=1;
                        midAverage -= minBetween;
                        break;

                    case("Low"):
                        lowCount-=1;
                        lowAverage -= minBetween;
                        break;
                }
                doneCount--;
            }


            todoList.remove(todoDelete);
            return ("Removed succesfully");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public Map<String,String> getTodoMetrics() {

        Map<String, String> metrics = new HashMap<>();
        metrics.put("Average","00:00");
        metrics.put("lowAverage","00:00");
        metrics.put("midAverage","00:00");
        metrics.put("highAverage","00:00");

        if(doneCount == 0){
            return metrics;
        }else{
            System.out.println(lowCount+" "+mediumCount+" "+highCount);
            if(lowAverage > 0){
                long promedio = lowAverage / lowCount;
                long h = promedio / 60;
                long m = promedio % 60;
                metrics.put("lowAverage",h+":"+m);
            }

            if (midAverage >0){
                long promedio = midAverage / mediumCount;
                long h = promedio / 60;
                long m = promedio % 60;
                metrics.put("midAverage",h+":"+m);
            }

            if(highAverage > 0){
                long promedio = highAverage / highCount;
                long h = promedio / 60;
                long m = promedio % 60;
                metrics.put("highAverage",h+":"+m);
            }
            System.out.println(lowAverage+" "+midAverage+" "+highAverage);
            long total = (lowAverage + midAverage + highAverage) / doneCount;

            long h = total / 60;
            long m = total % 60;
            metrics.put("Average",h+":"+m);

            System.out.println(metrics);
            return metrics;

        }




    }
}
