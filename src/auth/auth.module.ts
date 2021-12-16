import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmployeeModule } from '../employee/employee.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [EmployeeModule, PassportModule],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
