export class ApiClientError extends Error {
  constructor(message, status = 500, code = 'API_ERROR', details = null) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export async function apiRequest(path, options = {}) {
  const { timeoutMs = 10_000, headers = {}, body, ...rest } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const finalHeaders = isFormData ? headers : { 'Content-Type': 'application/json', ...headers };

  try {
    const response = await fetch(path, {
      ...rest,
      headers: finalHeaders,
      body: body && !isFormData && typeof body !== 'string' ? JSON.stringify(body) : body,
      credentials: 'same-origin',
      signal: controller.signal,
    });

    const json = await response.json().catch(() => null);
    if (!response.ok || (json && json.ok === false)) {
      throw new ApiClientError(
        json?.message || 'Request failed.',
        response.status,
        json?.error?.code || 'REQUEST_FAILED',
        json?.error?.details || null
      );
    }

    return json;
  } finally {
    clearTimeout(timer);
  }
}
