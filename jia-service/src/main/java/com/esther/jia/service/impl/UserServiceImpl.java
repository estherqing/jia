package com.esther.jia.service.impl;

import com.esther.jia.api.IUserService;
import org.springframework.stereotype.Service;

/**
 * @author esther
 * @create 2017-09-08 14:28
 * $DESCRIPTION}
 */
@Service
public class UserServiceImpl implements IUserService {
    @Override
    public void sayHello(String name) {
        System.out.println("Hello: "+name);
    }
}
