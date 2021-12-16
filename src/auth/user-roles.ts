import { RolesBuilder } from "nest-access-control";

export enum UserRoles {
    BU_HEAD = 'BU_HEAD',
    HR = 'HR',
    EMPLOYEE = 'EMPLOYEE'
}

export const roles: RolesBuilder = new RolesBuilder();

roles.grant(UserRoles.EMPLOYEE)
    .readOwn(['employees', 'certifications', 'pocs'])
    .updateOwn(['employees', 'certifications', 'pocs'])
    .createOwn(['employees', 'certifications', 'pocs'])
    .grant(UserRoles.BU_HEAD)
    .extend(UserRoles.EMPLOYEE)
    .readAny(['employees', 'certifications', 'pocs'])
    .updateAny(['employees', 'certifications', 'pocs'])
    .deleteAny(['employees', 'certifications', 'pocs'])
    .grant(UserRoles.HR)
    .extend(UserRoles.BU_HEAD);
