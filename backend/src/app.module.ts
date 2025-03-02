import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { TransactionModule } from './transaction/transaction.module';
import { CategoryModule } from './category/category.module';
import { GoalsModule } from './goals/goals.module';
import { OpinionsModule } from './opinions/opinions.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    AccountModule,
    TransactionModule,
    CategoryModule,
    GoalsModule,
    OpinionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
