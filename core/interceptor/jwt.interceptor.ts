import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";

export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const token = localStorage.getItem('token');
        if (token) {
            req = req.clone({
                setHeaders: { Authorization: `Bearer ${token}` },
            });
        }
        return next.handle(req);
    }
}