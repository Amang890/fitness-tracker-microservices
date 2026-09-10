package com.fitnessMicroServiceeApplication.userService.controller;

import com.fitnessMicroServiceeApplication.userService.dto.UserRequest;
import com.fitnessMicroServiceeApplication.userService.dto.UserResponse;
import com.fitnessMicroServiceeApplication.userService.service.UserServiceImpl;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {

    private  final UserServiceImpl userService ;
@PostMapping("/register")
 public   ResponseEntity<UserResponse> registerUser(@Valid @RequestBody UserRequest request){
        return ResponseEntity.ok(userService.registerUser(request));
    }
    @GetMapping("/{userId}")
   public ResponseEntity<UserResponse> getUserFromUserId(@PathVariable String userId){
        return ResponseEntity.ok(userService.getUserFromUserId(userId));
    }
    @GetMapping("/{userId}/validate")
    public ResponseEntity<Boolean> validateUser(@PathVariable String userId){
        return ResponseEntity.ok(userService.existByUserId(userId));
    }

}
