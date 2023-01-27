package com.opencbs.core.dto.responses;

/**
 * Created by Makhsut Islamov on 06.01.2017.
 */
public class ApiResponse <T> {
    private T data;

    public ApiResponse(T data){
        this.data = data;
    }
    public T getData() {
        return data;
    }
}