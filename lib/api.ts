const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

function getCookieByKey(key: string): string | undefined {
  const name = key + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");
  for (let i = 0; i < cookieArray.length; i++) {
    const cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return undefined;
}

function removeCookieByKey(key: string): void {
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export const api = async (
  endpoint: string,
  config: Record<string, unknown> = {}
) => {
  const {
    body,
    headers = {},
    method = "GET",
    ...customConfig
  } = config as {
    body?: unknown;
    headers?: Record<string, string>;
    method?: string;
  };

  const accessToken = getCookieByKey("accessToken");
  const socketId = localStorage.getItem("socketId");

  const isFormData = body instanceof FormData;

  // Define the headers object
  const headersObj: Record<string, string> = {
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "en-GB,en;q=0.9",
    ...(isFormData ? {} : { "Content-Type": "application/json" }), // Only set Content-Type for non-FormData
    Authorization: `Bearer ${accessToken || ""}`,
    "Tenant-ID": localStorage.getItem("activeTenantId") || "",
    ...(socketId ? { "X-Socket-ID": socketId } : {}),
    ...headers, // Spread any custom headers passed in
  };

  // Clean headers (remove undefined values)
  Object.keys(headersObj).forEach((key) => {
    if (headersObj[key] === undefined) {
      delete headersObj[key];
    }
  });

  const requestConfig: RequestInit = {
    method,
    headers: headersObj,
    credentials: "include", // Ensures cookies are sent with the request
    body: isFormData
      ? body
      : typeof body === "string"
      ? body
      : body !== undefined
      ? JSON.stringify(body) // Ensure body is stringified correctly
      : undefined,
    ...customConfig, // Include other custom configuration options
  };

  try {
    // const api_url = "http://localhost:5001";
    const api_url = BASE_URL;

    const response = await fetch(`${api_url}${endpoint}`, requestConfig);

    console.log("BASE_URL", BASE_URL);

    // Handle different HTTP statuses
    if (!response.ok) {
      if (response.status === 414) {
        console.error("URI Too Long Error (414) detected - logging out user");
        removeCookieByKey("accessToken");
        window.location.href = "/login";
        return null;
      }

      if (response.status === 401) {
        removeCookieByKey("accessToken");
        window.location.reload();
      }

      const error = await response
        .json()
        .catch(() => ({ message: "Something went wrong" }));
      throw new Error(error.message || "Something went wrong");
    }

    // Handle empty responses (204 No Content)
    if (response.status === 204) {
      return undefined;
    }

    // Return JSON if response type is application/json
    return response.headers.get("Content-Type")?.includes("application/json")
      ? response.json()
      : response;
  } catch (error: unknown) {
    throw error;
  }
};
