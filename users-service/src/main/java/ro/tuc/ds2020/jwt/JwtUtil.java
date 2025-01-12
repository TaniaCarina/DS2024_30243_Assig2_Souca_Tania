package ro.tuc.ds2020.jwt;

import org.springframework.stereotype.Component;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;
import java.util.List;
import java.util.function.Function;

@Component
public class JwtUtil {

    private static final String SECRET_KEY = "YXJlSHkHjS9FjNsYwYmPnKbFgVcLdMxTnWlRkQ=";

    public String createToken(String userIdentifier, List<String> roles) {
        return Jwts.builder()
                .setSubject(userIdentifier)
                .claim("permissions", roles)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 20))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public boolean isValidToken(String token, String userIdentifier) {
        final String extractedUsername = getUsernameFromToken(token);
        return extractedUsername.equals(userIdentifier) && !hasTokenExpired(token);
    }

    public String getUsernameFromToken(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date getTokenExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims allClaims = getAllClaims(token);
        return claimsResolver.apply(allClaims);
    }

    private Claims getAllClaims(String token) {
        return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
    }

    private boolean hasTokenExpired(String token) {
        return getTokenExpiration(token).before(new Date());
    }
}
