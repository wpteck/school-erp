import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health/health.controller.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ClassesModule } from './classes/classes.module.js';
import { StudentsModule } from './students/students.module.js';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, ClassesModule, StudentsModule],
  controllers: [HealthController],
})
export class AppModule {}