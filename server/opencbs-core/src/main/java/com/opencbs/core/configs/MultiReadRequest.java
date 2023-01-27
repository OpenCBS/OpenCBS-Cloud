package com.opencbs.core.configs;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;

import javax.servlet.ReadListener;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;

@Slf4j
public class MultiReadRequest extends HttpServletRequestWrapper {

    private final byte cashedBytes[];


    public MultiReadRequest(HttpServletRequest request) throws IOException {
        super(request);
        cashedBytes = IOUtils.toByteArray(request.getInputStream());
    }

    @Override
    public ServletInputStream getInputStream() throws IOException {
        final ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(cashedBytes);

        ServletInputStream inputStream = new ServletInputStream() {
            @Override
            public boolean isFinished() {
                return byteArrayInputStream.available() == 0;
            }

            @Override
            public boolean isReady() {
                return false;
            }

            @Override
            public void setReadListener(ReadListener listener) {
            }

            public int read() throws IOException {
                return byteArrayInputStream.read();
            }
        };

        return inputStream;
    }

    @Override
    public BufferedReader getReader() {
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(cashedBytes);
        return new BufferedReader(new InputStreamReader(byteArrayInputStream));
    }
}