import { mock } from '../config';

mock.mock('/api/v1/account/logout', 'post',
    {
        "message": null,
        "code": "SUCCESS",
        "success": true
    });
