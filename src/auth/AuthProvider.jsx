import { createContext, useContext, useEffect, useMemo, useState } from "react";
import keycloak from "./keycloak";

const AuthContext = createContext({
  keycloak,
  authenticated: false,
  ready: false,
  roles: [],
  hasRole: () => false,
});

let keycloakInitPromise = null;

export default function AuthProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (!keycloakInitPromise) {
      keycloakInitPromise = keycloak.init({
        onLoad: "check-sso",
        silentCheckSsoRedirectUri:
          window.location.origin + "/silent-check-sso.html",
        pkceMethod: "S256",
        checkLoginIframe: false,
      });
    }

    keycloakInitPromise
      .then((auth) => {
        setAuthenticated(auth);

        if (auth) {
          const realmRoles = keycloak.tokenParsed?.realm_access?.roles || [];
          setRoles(realmRoles);
        } else {
          setRoles([]);
        }

        setReady(true);

        if (!auth) {
          keycloak.login();
        }
      })
      .catch((err) => {
        console.error("Keycloak init error", err);
      });
  }, []);

  const value = useMemo(() => {
    const hasRole = (roleName) => roles.includes(roleName);

    return {
      keycloak,
      authenticated,
      ready,
      roles,
      hasRole,
    };
  }, [authenticated, ready, roles]);

  if (!ready) {
    return <div>Loading authentication...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export { keycloak };
