declare var process: any;
declare var setInterval: any;
declare var clearInterval: any;
declare namespace NodeJS {
  type Timeout = any;
}

declare module 'path' {
  export function resolve(...args: string[]): string;
  export function join(...args: string[]): string;
  export function dirname(p: string): string;
  export function basename(p: string): string;
  export default { resolve, join, dirname, basename };
}

declare module 'fs' {
  export function existsSync(p: string): boolean;
  export function readFileSync(p: string, encoding?: string): string;
  export function writeFileSync(p: string, data: any): void;
  export default { existsSync, readFileSync, writeFileSync };
}

declare module 'http' {
  export interface Server {
    listen(port: number, callback?: () => void): this;
    close(callback?: () => void): this;
  }
  export function createServer(handler?: any): Server;
}

declare module 'express' {
  import * as http from 'http';
  export interface Request {
    headers: Record<string, any>;
    cookies: Record<string, any>;
    body: any;
    params: Record<string, string>;
    query: Record<string, any>;
    path: string;
    method: string;
    user?: any;
    token?: string;
  }
  export interface Response {
    status(code: number): this;
    json(body: any): this;
    cookie(name: string, val: any, opts?: any): this;
    clearCookie(name: string, opts?: any): this;
    send(body?: any): this;
    sendStatus(code: number): this;
    sendFile(path: string): void;
  }
  export type NextFunction = (err?: any) => void;
  export type RequestHandler = (req: Request, res: Response, next: NextFunction) => any;
  export type ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => any;
  export interface RouterInstance {
    use(...handlers: any[]): this;
    get(path: string, ...handlers: any[]): this;
    post(path: string, ...handlers: any[]): this;
    put(path: string, ...handlers: any[]): this;
    patch(path: string, ...handlers: any[]): this;
    delete(path: string, ...handlers: any[]): this;
  }
  export interface Express extends RouterInstance {
    listen(port: number, callback?: () => void): http.Server;
  }
  function express(): Express;
  namespace express {
    export function json(opts?: any): RequestHandler;
    export function urlencoded(opts?: any): RequestHandler;
    export function static(root: string, opts?: any): RequestHandler;
    export function Router(): RouterInstance;
  }
  export const Router: () => RouterInstance;
  export default express;
}

declare module 'cors' {
  import { RequestHandler } from 'express';
  export default function cors(options?: any): RequestHandler;
}

declare module 'helmet' {
  import { RequestHandler } from 'express';
  export default function helmet(options?: any): RequestHandler;
}

declare module 'cookie-parser' {
  import { RequestHandler } from 'express';
  export default function cookieParser(secret?: string, options?: any): RequestHandler;
}

declare module 'dotenv' {
  export function config(options?: any): { parsed?: Record<string, string> };
  export default { config };
}

declare module 'jsonwebtoken' {
  export function sign(payload: any, secret: string, options?: any): string;
  export function verify(token: string, secret: string, options?: any): any;
  export function decode(token: string): any;
  export default { sign, verify, decode };
}

declare module 'bcryptjs' {
  export function genSalt(rounds?: number): Promise<string>;
  export function genSaltSync(rounds?: number): string;
  export function hash(s: string, salt: number | string): Promise<string>;
  export function hashSync(s: string, salt: number | string): string;
  export function compare(s: string, hash: string): Promise<boolean>;
  export function compareSync(s: string, hash: string): boolean;
  export default { genSalt, genSaltSync, hash, hashSync, compare, compareSync };
}

declare module 'socket.io' {
  import * as http from 'http';
  export class Socket {
    id: string;
    handshake: any;
    user?: any;
    join(room: string): void;
    leave(room: string): void;
    emit(event: string, ...args: any[]): boolean;
    on(event: string, listener: (...args: any[]) => void): this;
  }
  export class Server {
    constructor(srv?: http.Server | number, opts?: any);
    use(fn: (socket: Socket, next: (err?: any) => void) => void): this;
    on(event: 'connection', listener: (socket: Socket) => void): this;
    to(room: string): { emit: (event: string, ...args: any[]) => void };
  }
  export default Server;
}
