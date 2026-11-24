/**
 * Normalizes backend errors: ServiceResult ({ message, errors: [] }) and ASP.NET validation problems
 * ({ title, errors: { field: [] } }).
 */
export function getApiError(error, fallback) {
    const data = error?.response?.data;
    const message = data?.message ?? data?.Message ?? data?.title ?? fallback;

    let details = [];
    if (Array.isArray(data?.errors)) {
        details = data.errors;
    } else if (data?.errors && typeof data.errors === 'object') {
        details = Object.values(data.errors).flat();
    }

    return { message, details };
}