import { BASE_URL } from "@env";

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
    ...customConfig
  } = config as { body?: unknown; headers?: Record<string, string> } & Record<
    string,
    unknown
  >;
  const accessToken = getCookieByKey("accessToken");
  const socketId = localStorage.getItem("socketId");

  const isFormData = body instanceof FormData;

  const headersObj: Record<string, string> = {
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "en-GB,en;q=0.9",
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    Authorization: `Bearer ${accessToken || ""}`,
    "Tenant-ID": localStorage.getItem("activeTenantId") || "",
    ...(socketId ? { "X-Socket-ID": socketId } : {}),
    ...headers,
  };

  Object.keys(headersObj).forEach((key) => {
    if (headersObj[key] === undefined) {
      delete headersObj[key];
    }
  });

  const requestConfig: RequestInit = {
    method: String(config.method ?? "GET"),
    headers: headersObj,
    credentials: "include",
    body: isFormData
      ? body
      : typeof body === "string"
      ? body
      : JSON.stringify(body),
    ...customConfig,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, requestConfig);

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

    if (response.status === 204) {
      return undefined;
    }

    return response.headers.get("Content-Type")?.includes("application/json")
      ? response.json()
      : response;
  } catch (error: unknown) {
    throw error;
  }
};
