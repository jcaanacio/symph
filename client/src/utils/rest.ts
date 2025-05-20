export async function fetchWithErrorHandling<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, init);

  if (!res.ok) {
    let errorMsg = `Error ${res.status}`;
    try {
      const body = await res.json();
      errorMsg = body.message || errorMsg;
    } catch (_) {
      // fallback to generic error
    }

    throw new Error(errorMsg);
  }

  console.log(res);

  return res ? res.json() : true;
}
