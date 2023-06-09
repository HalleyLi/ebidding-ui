import { LoginParams, Role } from '@app/core/services/login.service';
import { intercepter, mock } from '../config';
import { fnGetUUID } from '@app/utils/tools';

mock.mock('/api/v1/account/login', 'post', (config: any) => {
  const body: LoginParams = JSON.parse(config?.body);
  return intercepter({
    "id": fnGetUUID(),
    "name": body.username,
    "memberSince": "2022-05-07T11:56:49Z",
    "role": body.username?.toLocaleLowerCase().indexOf("trader") > -1 ? Role.SALES : Role.CLIENT,
    "token": "will implement jwt token soon"
  });
});
