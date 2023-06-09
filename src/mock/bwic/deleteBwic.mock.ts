import { BwicCancelParams } from '@app/models/bwic/bwic';
import { intercepter, mock } from '../config';

mock.mock('/api/v1/bwic/delete', 'post', (config: any) => {
    const body: BwicCancelParams = JSON.parse(config?.body);
    console.log("Cancel Bwic", body)
    const id = body.id;
    return intercepter({
        id: id,
        cusip: "CUSIP_" + id,
        issuer: "Issuer_" + id,
        dueDate: new Date(),
        clientId: "Sales_" + id,
        size: Math.round(Math.random() * 100) * 100000000,
        version: 1
    });
});
