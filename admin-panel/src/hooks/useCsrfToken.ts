// hooks/useCsrfToken.ts
import { useEffect, useState } from "react";

export default function useCsrfToken() {
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/csrf-token", {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setCsrfToken(data.csrfToken))
      .catch(() => setCsrfToken(""));
  }, []);

  return csrfToken;
}
