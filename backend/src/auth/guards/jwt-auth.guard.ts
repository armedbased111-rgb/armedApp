import { Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log('Guard activated, Authorization header:', request.headers.authorization);
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
  console.log('Guard handleRequest - err:', err, 'user:', user, 'info:', info);
  if (err || !user) {
    throw err || new UnauthorizedException('Invalid token');
  }
  return user;
}
}