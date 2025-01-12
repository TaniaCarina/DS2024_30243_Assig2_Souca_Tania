package ro.tuc.ds2020.authorization;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.SignatureException;

import java.util.Base64;

public class TokenValidator {

    private static final String SECRETKEY = "sdjeile2UdUYfdPeNtskjhdh0dLFKtpNWhhusRP5sy6E=";
    private static Base64.Decoder decoder = Base64.getUrlDecoder();

    public static Claims extractAllClaims(String token) throws SignatureException {
        return Jwts.parser().setSigningKey(SECRETKEY).parseClaimsJws(token).getBody();
    }

    public static Boolean validate(String token){
        try{
            extractAllClaims(token);
            System.out.println("Token validated!\n");
            return true;
        }catch(SignatureException ex){
//            System.out.println("Token NOT validated!\n");
        }
        System.out.println("\nVALIDATION FAILED!!!\n");
        return false;
    }
}
