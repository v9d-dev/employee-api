import { Injectable, Logger } from '@nestjs/common';
import { EmployeeService } from '../employee/employee.service';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(private employeeService: EmployeeService) {}

  async validateUser(username: string, pass: string) {
    const user = await this.employeeService.getSingleEmployee(username);
    const { data } = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${pass}`).then(res => res).catch(err => err);
    if (user && data && Number(new Date()) < Number(`${data.exp}000`) && data.hd === 'successive.tech') {
      return user;
    }
    return null;
  }
}
