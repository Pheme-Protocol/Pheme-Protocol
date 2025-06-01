import { Module } from '@nestjs/common';
import { SkillWalletController } from './controllers/SkillWalletController';

@Module({
  imports: [],
  controllers: [SkillWalletController],
  providers: [],
})
export class AppModule {} 