import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { poolConfig, PostgresModule } from './postgres';
import { RelationRulesModule } from './relation-rules';
import { SkipTimesModule } from './skip-times';
import { MorganMiddleware } from './utils';

@Module({
  imports: [
    PostgresModule.forRoot(poolConfig),
    SkipTimesModule,
    RelationRulesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(MorganMiddleware).forRoutes('*');
  }
}
