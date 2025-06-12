import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CustomersModule } from './customers/customers.module';
import { getDatabaseConfig } from './config/database.config';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AuthModule } from './auth/auth.module';
import { BaseModule } from './common/base/base.module';
import { SupplierModule } from './supplier/supplier.module';
// import { SupplierDetailsModule } from './supplier-details/supplier-details.module';
import { ItemsModule } from './items/items.module';
import { ItemPriceModule } from './item-price/item-price.module';
import { SuggestionItemModule } from './suggestion-item/suggestion-item.module';
import { SuggestionSupplierService } from './suggestion-supplier/suggestion-supplier.service';
import { SuggestionSupplierModule } from './suggestion-supplier/suggestion-supplier.module';
import { PurchaseRequestModule } from './purchase-request/purchase-request.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => getDatabaseConfig(configService),
      inject: [ConfigService],
    }),
    CustomersModule,
    AuthModule,
    BaseModule,
    SupplierModule,
    ItemsModule,
    ItemPriceModule,
    SuggestionItemModule,
    SuggestionSupplierModule,
    PurchaseRequestModule,
    // SupplierDetailsModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    // SuggestionSupplierService,
  ],
})
export class AppModule { }
