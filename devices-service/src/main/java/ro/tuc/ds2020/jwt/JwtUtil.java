package ro.tuc.ds2020.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtUtil {
    @Value("YXJlSHkHjS9FjNsYwYmPnKbFgVcLdMxTnWlRkQ=")
    private String secretKey;

    public Claims extractAllClaims(String token) throws SignatureException {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
    }

    public String extractUsername(String token) { return extractAllClaims(token).getSubject();}

    public List<SimpleGrantedAuthority> extractAuthorities(String token){
        Claims claims = extractAllClaims(token);
        List<String> roles = claims.get("roles", List.class);
        return roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    public boolean isTokenValid(String token) {
        try {
            extractAllClaims(token);
            System.out.println("Token validation successful.");
            return true;
        } catch (SignatureException e) {
            System.err.println("Invalid token signature.");
        } catch (Exception e) {
            System.err.println("Token validation failed: " + e.getMessage());
        }
        return false;
    }
}
