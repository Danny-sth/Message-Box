package com.example.messagebox.controller;

import com.example.messagebox.exceptions.NotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/messages")
public class MessageController {

    private int counter = 4;
    private List<Map<String, String>> messageList = new ArrayList<>(){{
        add(new HashMap<String, String>() {{ put("id", "1"); put("text", "First message"); }});
        add(new HashMap<String, String>() {{ put("id", "2"); put("text", "Second message"); }});
        add(new HashMap<String, String>() {{ put("id", "3"); put("text", "Third message"); }});
}};

    @GetMapping
    public List<Map<String, String>> getMessageList() {
        return messageList;
    }

    @GetMapping("/{id}")
    public Map<String, String> getMessageByID(@PathVariable String id) {
        return getByIdFromMessageList(id);
    }

    private Map<String, String> getByIdFromMessageList(String id) {
        return messageList.stream()
                .filter(message -> message.get("id").equals(id))
                .findFirst()
                .orElseThrow(NotFoundException::new);
    }

    @PostMapping
    public Map<String, String> createMessage(
            @RequestBody Map<String, String> message) {
        message.put("id", String.valueOf(counter++));
        messageList.add(message);
        return message;
    }

    @PutMapping("/{id}")
    public Map<String, String> editMessage(@PathVariable String id,
                                           @RequestBody Map<String, String> message) {
        Map<String, String> messageForEdit = getByIdFromMessageList(id);
        messageForEdit.putAll(message);
        messageForEdit.put("id", id);
        return messageForEdit;
    }

    @DeleteMapping("{id}")
    public void deleteMessage(@PathVariable String id) {
        Map<String, String> message = getByIdFromMessageList(id);
        messageList.remove(message);
    }

}
