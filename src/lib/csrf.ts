export const CSRF_HEADER_NAME = 'X-CSRF-Token';

export function getCsrfToken(): string {
  if (typeof document === 'undefined') return '';
  const cookie = document.cookie.split('; ').find((value) => value.startsWith('cbc_csrf_token='));
  return cookie ? decodeURIComponent(cookie.slice('cbc_csrf_token='.length)) : '';
}

export function csrfHeaders(): HeadersInit {
  const token = getCsrfToken();
  return token ? { [CSRF_HEADER_NAME]: token } : {};
}
