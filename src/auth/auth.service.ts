import { Injectable, Logger } from '@nestjs/common';
import { EmployeeService } from '../employee/employee.service';
import axios from 'axios';
import { UserRoles } from './user-roles';

@Injectable()
export class AuthService {
  constructor(private employeeService: EmployeeService) {}

  async validateUser(request: Request, username: string, pass: string) {
    try {
      const user = await this.employeeService.getSingleEmployee(username);
      if( user && (user._id.toString() === username || user.roles !== UserRoles.EMPLOYEE)) {
        const { data } = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${pass}`).then(res => res).catch(err => err);
        if (data && data.email === user.mailId && Number(new Date()) < Number(`${data.exp}000`) && data.hd === 'successive.tech') {
          return user;
        }
      }
      return null;
    } catch(err) {
      const { statusCode, message } = err.message;
      const { route, query } = request;
      const { path, methods } = route;
      if( statusCode === 404 && message === 'Could not find employee.' && query.username === 'New' && path === '/employee' && methods.post) {
        return true;
      }
  }
}
