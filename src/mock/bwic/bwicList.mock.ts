import { BWICItem } from '@app/models/bwic/bwic';
import { intercepter, mock } from '../config';

mock.mock('/bwc/api/v1/bwic/list', 'get', (config: any) => {
    let allBWICs: BWICItem[] = [];
   console.log(`config.params: ${config?.params}`);
    new Array(100).forEach((item, index) => {
        allBWICs.push({
            id: index.toString(),
            cusip: "CUSIP_" + (index % 3).toString(),
            issuer: "Issuer_" + index.toString(),
            dueDate: new Date(),
            clientId: "Sales_" + index.toString(),
            size: Math.round(Math.random() * 100) * 100000000,
            version: index % 3,
            isOverDue: false
        });
    });
    console.log(`allbwics: ${allBWICs}`);
    return intercepter(allBWICs, true);
});
