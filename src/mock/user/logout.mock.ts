import { mock } from '../config';

mock.mock('site/api/v1/account/logout', 'post',
    {
        "message": null,
        "code": "SUCCESS",
        "success": true
    });
