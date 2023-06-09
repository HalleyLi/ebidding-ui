import { BWICBidItem } from '@app/models/bwic/bwic';
import { intercepter, mock } from '../config';

mock.mock(RegExp('/api/v1/bwic/bwic-bid-details'), 'get', (config: any) => {
    let allBWICs: BWICBidItem[] = [];
    new Array(100).fill(undefined).forEach((item, index) => {
        allBWICs.push({
            bwicDto: {
                id: index.toString(),
                cusip: "CUSIP_" + (index % 3).toString(),
                issuer: "Issuer_" + index.toString(),
                dueDate: new Date(),
                clientId: "Sales_" + index.toString(),
                size: Math.round(Math.random() * 100) * 100000000,
                version: index % 3,
                isOverDue: false
            },
            bids: [{
                id: "1",
                bwicId: index.toString(),
                clientId: "123-1",
                effectiveTime: new Date(),
                feedback: "Test",
                price: Math.round(Math.random() * 100),
                rank: 1,
                size: Math.round(Math.random() * 100) * 1000000,
                transactionId: "123",
                version: index
            }, {
                id: "2",
                bwicId: index.toString(),
                clientId: "123-2",
                effectiveTime: new Date(),
                feedback: "Test",
                price: Math.round(Math.random() * 100),
                rank: 2,
                size: Math.round(Math.random() * 100) * 1000000,
                transactionId: "123",
                version: index
            }]
        });
    });

    return intercepter(allBWICs, true)
});
