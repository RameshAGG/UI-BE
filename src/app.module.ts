import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module'; 
import { UsersModule } from './users/users.module';
import { CustomersModule } from './customers/customers.module';
import { RequestsModule } from './requests/requests.module';
import { VendorsModule } from './vendor/vendor.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { MasterModule } from './master/master.module';
import { SubServiceMasterModule } from './sub-master/submaster.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'casecare',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      synchronize: false,
      migrationsRun: true,
      migrationsTableName: 'migrations',
    }),
    UsersModule,
    AuthModule,
    CustomersModule,
    RequestsModule,
    VendorsModule,
    AssignmentsModule,
    MasterModule,
    SubServiceMasterModule,
  ],
})
export class AppModule {}



