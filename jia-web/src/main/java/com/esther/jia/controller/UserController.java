package com.esther.jia.controller;

import com.esther.jia.api.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author esther
 * @create 2017-09-08 16:00
 * $DESCRIPTION}
 */
@Controller
@RequestMapping("/user")
public class UserController {
    @Autowired

    private IUserService userService;

    @ResponseBody
    @RequestMapping("/hello")
    public void sayHello(String name){
        userService.sayHello(name);
    }

}
