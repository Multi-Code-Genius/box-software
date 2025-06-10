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

// function removeCookieByKey(key: string): void {
//   document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
// }

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

  const headersObj: Record<string, string> = {
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "en-GB,en;q=0.9",
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    Authorization: `Bearer ${accessToken || ""}`,
    "Tenant-ID": localStorage.getItem("activeTenantId") || "",
    ...(socketId ? { "X-Socket-ID": socketId } : {}),
    ...headers,
  };

  if (isFormData) {
    delete headersObj["Content-Type"];
  }

  Object.keys(headersObj).forEach((key) => {
    if (headersObj[key] === undefined) {
      delete headersObj[key];
    }
  });

  const requestConfig: RequestInit = {
    method,
    headers: headersObj,
    credentials: "include",
    body: isFormData
      ? body
      : typeof body === "string"
      ? body
      : body !== undefined
      ? JSON.stringify(body)
      : undefined,
    ...customConfig,
  };

  try {
    const api_url = BASE_URL;

    // const api_url = "http://localhost:1008";

    const response = await fetch(`${api_url}${endpoint}`, requestConfig);

    if (!response.ok) {
      // if (response.status === 414) {

      //   // removeCookieByKey("accessToken");
      //   window.location.href = "/login";
      //   return null;
      // }

      if (response.status === 401) {
        // removeCookieByKey("accessToken");
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
