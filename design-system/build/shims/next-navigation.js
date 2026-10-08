export function usePathname() { return '/'; }
export function useRouter() { return { push() {}, replace() {}, back() {}, forward() {}, prefetch() {}, refresh() {} }; }
export function useSearchParams() { return new URLSearchParams(); }
export function notFound() {}
export function redirect() {}
