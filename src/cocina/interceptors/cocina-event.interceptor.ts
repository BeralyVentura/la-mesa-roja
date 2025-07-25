import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { CocinaEventService } from '../events/cocina-event.service';

@Injectable()
export class CocinaEventInterceptor implements NestInterceptor {
  constructor(private readonly eventService: CocinaEventService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const endpoint = request.url;

    return next.handle().pipe(
      tap((data) => {
        if (endpoint.includes('/ordenes') && request.method === 'POST' && data?.id) {
          setTimeout(async () => {
            try {
              console.log(`🔔 Auto-creando notificación para orden #${data.id}`);
            } catch (error) {
              console.error('Error al crear notificación automática:', error);
            }
          }, 1000);
        }
      }),
    );
  }
}