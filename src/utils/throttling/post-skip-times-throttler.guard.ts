import { ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import * as md5 from 'md5';

export class PostSkipTimesThrottlerGuard extends ThrottlerGuard {
  generateKey(context: ExecutionContext, suffix: string): string {
    const { req } = this.getRequestResponse(context);
    const prefix = `${context.getClass().name}-${context.getHandler().name}-${
      req.params.animeId
    }-${req.params.episodeNumber}`;

    return md5(`${prefix}-${suffix}`);
  }
}
