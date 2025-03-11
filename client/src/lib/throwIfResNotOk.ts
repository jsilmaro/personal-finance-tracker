export async function throwIfResNotOk(res: Response): Promise<void> {
  if (!res.ok) {
    try {
      const errorData = await res.json().catch(() => ({ message: res.statusText || "Request failed" }));
      const errorMessage = errorData?.message || res.statusText || "Request failed";
      const error = new Error(errorMessage);
      // @ts-ignore
      error.status = res.status;
      // @ts-ignore
      error.statusText = res.statusText;
      throw error;
    } catch (e) {
      if (e instanceof SyntaxError) {
        // Not JSON response
        const error = new Error(res.statusText || "Request failed");
        // @ts-ignore
        error.status = res.status;
        throw error;
      }
      throw e;
    }
  }
}