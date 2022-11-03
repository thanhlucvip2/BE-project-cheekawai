import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpErrorFilter } from './shared/http-error.filter';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} from './@config/constants';
import { UserModule } from './user/user.module';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { ProductTypeModule } from './app/product_type/product_type.module';
import { SupplierModule } from './app/supplier/supplier.module';
import { ClientModule } from './app/client/client.module';
import { ReceiveModule } from './app/receive/receive.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get(DB_HOST),
        port: +configService.get(DB_PORT),
        username: configService.get(DB_USER),
        password: configService.get(DB_PASSWORD),
        database: configService.get(DB_NAME),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ProductTypeModule,
    SupplierModule,
    ClientModule,
    ReceiveModule,
  ],

  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter, // import httpError vào module
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor, // import interceptor vào module
    },
  ],
})
export class AppModule {}
