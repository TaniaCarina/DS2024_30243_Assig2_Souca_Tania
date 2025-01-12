package ro.tuc.ds2020.authorization;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.StompSubProtocolErrorHandler;

import java.util.List;

@Component
public class AuthChannelInterceptor implements org.springframework.messaging.support.ChannelInterceptor {
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        List<String> authHeader = accessor.getNativeHeader("Authorization");

        if (authHeader != null && !authHeader.isEmpty()) {
            String token = authHeader.get(0).replace("Bearer ", "");
            // Verifică token-ul (folosește serviciul de autentificare existent)
            if (!TokenValidator.validate(token)) {
                throw new IllegalArgumentException("Invalid Token!");
            }
        } else {
            throw new IllegalArgumentException("No Authorization Header Found!");
        }
        return message;
    }
}