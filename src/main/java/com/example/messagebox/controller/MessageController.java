package com.example.messagebox.controller;

import com.example.messagebox.exceptions.NotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/messages")
public class MessageController {

    public List<Map<String, String>> messageList = new ArrayList<>(){{
        add(new HashMap<String, String>() {{ put("id", "1"); put("text", "First message"); }});
        add(new HashMap<String, String>() {{ put("id", "2"); put("text", "Second message"); }});
        add(new HashMap<String, String>() {{ put("id", "3"); put("text", "Third message"); }});
}};

    @GetMapping
    public List<Map<String, String>> getMessageList() {
        return messageList;
    }

    @GetMapping("/{id}")
    public Map<String, String> getMessageByID(@PathVariable int id) {
        return getByIdFromMessageList(id);
    }

    private Map<String, String> getByIdFromMessageList(int id) {
        return messageList.stream()
                .filter(message -> message.get("id").equals(id))
                .findFirst()
                .orElseThrow(NotFoundException::new);
    }

}
