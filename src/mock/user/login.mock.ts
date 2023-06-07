import { LoginParams, Role } from '@app/core/services/login.service';
import { intercepter, mock } from '../config';

mock.mock('/api/v1/account/login', 'post', (config: any) => {
  const body: LoginParams = JSON.parse(config?.body);

  return intercepter({
    "id": "1",
    "name": "test-trader",
    "memberSince": "2022-05-07T11:56:49Z",
    "role": body.username?.toLocaleLowerCase().indexOf("client") > -1 ? Role.CLIENT : Role.SALES,
    "token": "will implement jwt token soon"
  });
});
