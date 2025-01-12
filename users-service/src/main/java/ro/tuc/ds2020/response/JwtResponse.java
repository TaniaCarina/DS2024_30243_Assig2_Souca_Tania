package ro.tuc.ds2020.response;

import java.util.List;

public class JwtResponse {

    private String accessToken;
    private String tokenType = "Bearer";
    private String user;
    private List<String> permissions;

    public JwtResponse(String accessToken, String user, List<String> permissions) {
        this.accessToken = accessToken;
        this.user = user;
        this.permissions = permissions;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public List<String> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<String> permissions) {
        this.permissions = permissions;
    }
}
