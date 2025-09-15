package com.raastabuzz.config;

import java.io.IOException;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class WebSocketCorsFilter implements Filter {

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletResponse response = (HttpServletResponse) res;
        HttpServletRequest request = (HttpServletRequest) req;

        String origin = request.getHeader("Origin");
        String requestURI = request.getRequestURI();
//        System.out.println("for gods sake1");
//        System.out.println(requestURI);
//        System.out.println("soumik bhai");
        // Apply CORS headers for WebSocket related requests
        if (requestURI != null && (requestURI.startsWith("/ws")  || requestURI.contains("sockjs"))) {
//            System.out.println("1");
            // Allow specific origins or all for development
            if (origin != null && (origin.startsWith("http://localhost:")
                    || origin.startsWith("http://ec2-51-20-34-148.eu-north-1.compute.amazonaws.com:3030")
                    || origin.startsWith("http://16.171.58.56:3000"))) {
                response.setHeader("Access-Control-Allow-Origin", origin);
//                System.out.println("2");
            } else if (origin != null && origin.startsWith("http://localhost:")) {
                response.setHeader("Access-Control-Allow-Origin", origin);
//                System.out.println("3");
            }
//            System.out.println("klilkldkojhklsd");

            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            response.setHeader("Access-Control-Allow-Headers",
                    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control");
            response.setHeader("Access-Control-Max-Age", "3600");

            // Handle preflight requests
            if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
                response.setStatus(HttpServletResponse.SC_OK);
                return;
            }
        }

        chain.doFilter(req, res);
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // No initialization needed
    }



    @Override
    public void destroy() {
        // No cleanup needed
    }
}