declare module '*.css';

declare module 'react' {
  export = React;
}
declare namespace React {
  export type ReactNode = any;
  export type FC<P = {}> = (props: P) => any;
  export interface CSSProperties {
    [key: string]: any;
  }
  export interface HTMLAttributes<T> {
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
    id?: string;
    onClick?: (e: any) => void;
    onChange?: (e: any) => void;
    onSubmit?: (e: any) => void;
    role?: string;
    tabIndex?: number;
    title?: string;
    [key: string]: any;
  }
  export interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    name?: string;
    value?: string | number | readonly string[];
  }
  export interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    type?: string;
    value?: any;
    defaultValue?: any;
    placeholder?: string;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    name?: string;
    min?: any;
    max?: any;
    step?: any;
    checked?: boolean;
  }
  export interface SelectHTMLAttributes<T> extends HTMLAttributes<T> {
    value?: any;
    defaultValue?: any;
    disabled?: boolean;
    required?: boolean;
    name?: string;
    multiple?: boolean;
  }
  export interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
    value?: any;
    defaultValue?: any;
    placeholder?: string;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    rows?: number;
    cols?: number;
    name?: string;
  }
  export interface FormEvent<T = Element> {
    preventDefault(): void;
    stopPropagation(): void;
    target: any;
    currentTarget: any;
  }
  export interface ChangeEvent<T = Element> {
    target: any;
  }
  export interface MouseEvent<T = Element> {
    preventDefault(): void;
    stopPropagation(): void;
    target: any;
  }
  export function useState<T>(init: T | (() => T)): [T, (val: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useCallback<T extends (...args: any[]) => any>(fn: T, deps: any[]): T;
  export function useMemo<T>(fn: () => T, deps: any[]): T;
  export function useRef<T>(init?: T): { current: T };
  export function createContext<T>(init: T): any;
  export function useContext<T>(ctx: any): T;
  export function forwardRef<T, P = {}>(render: (props: P, ref: any) => any): ((props: P & { ref?: any }) => any) & { displayName?: string };
  export function createElement(type: any, props?: any, ...children: any[]): any;
  export const Fragment: any;
  export const StrictMode: any;
}

declare module 'react-dom/client' {
  export function createRoot(container: any): { render(element: any): void };
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare module 'react-router-dom' {
  export function createBrowserRouter(routes: any[], opts?: any): any;
  export const RouterProvider: React.FC<{ router: any }>;
  export const BrowserRouter: React.FC<{ children?: React.ReactNode }>;
  export const Routes: React.FC<{ children?: React.ReactNode }>;
  export const Route: React.FC<{ path?: string; element?: React.ReactNode; index?: boolean }>;
  export const Link: React.FC<{ to: string; className?: string; children?: React.ReactNode; [key: string]: any }>;
  export const NavLink: React.FC<{ to: string; className?: any; children?: React.ReactNode; [key: string]: any }>;
  export const Outlet: React.FC<any>;
  export const Navigate: React.FC<{ to: string; replace?: boolean }>;
  export function useNavigate(): (to: string, opts?: any) => void;
  export function useParams<T = Record<string, string>>(): T;
  export function useSearchParams(): [URLSearchParams, (params: any) => void];
  export function useLocation(): { pathname: string; search: string; hash: string; state: any };
  export function useOutletContext<T = any>(): T;
}

declare module '@tanstack/react-query' {
  export class QueryClient {
    constructor(opts?: any);
    invalidateQueries(opts?: any): Promise<void>;
  }
  export const QueryClientProvider: React.FC<{ client: QueryClient; children?: React.ReactNode }>;
  export function useQuery(options: any): { data: any; isLoading: boolean; isError: boolean; error: any; refetch: () => void };
  export function useMutation(options: any): { mutate: (variables?: any) => void; mutateAsync: (variables?: any) => Promise<any>; isPending: boolean; error: any };
}

declare module 'lucide-react' {
  export const ArrowLeft: any;
  export const ArrowRight: any;
  export const Bell: any;
  export const Calendar: any;
  export const Check: any;
  export const CheckCircle: any;
  export const Clock: any;
  export const ExternalLink: any;
  export const Eye: any;
  export const EyeOff: any;
  export const Filter: any;
  export const Globe: any;
  export const LogOut: any;
  export const MessageSquare: any;
  export const Search: any;
  export const Send: any;
  export const Settings: any;
  export const Shield: any;
  export const Star: any;
  export const User: any;
  export const UserCheck: any;
  export const UserPlus: any;
  export const UserX: any;
  export const Users: any;
  export const Video: any;
  export const X: any;
  export const AlertCircle: any;
  export const AlertTriangle: any;
  export const Info: any;
  export const BookOpen: any;
  export const Sparkles: any;
  export const Menu: any;
  export const Compass: any;
  export const History: any;
  export const LayoutDashboard: any;
  export const Flag: any;
  export const BarChart3: any;
  export const Activity: any;
  export const ShieldAlert: any;
  export const ShieldCheck: any;
  export const Edit: any;
  export const XCircle: any;
  export const RefreshCw: any;
  export const CheckCircle2: any;
  export const Plus: any;
  const anyIcon: any;
  export default anyIcon;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
