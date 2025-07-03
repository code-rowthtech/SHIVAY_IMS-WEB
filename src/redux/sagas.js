// @flow
import { all } from 'redux-saga/effects';

import authSaga from './auth/saga';
import layoutSaga from './layout/saga';
import dashboardSaga from './dashboard/saga';
import roleSaga from './roles/saga';
import warehouseSaga from './warehouse/saga';
import locationSaga from './location/saga';
import inventorySaga from './inventory/saga';
import userSaga from './users/saga';
import customerSaga from './customer/saga';
import supplierSaga from './supplier/saga';
import stockSaga from './openingStock/saga';
import stockInSaga from './stockIn/saga';
import dispatchSaga from './dispatch/saga';
import reportSaga from './report/saga';
import notificationSaga from './notification/saga';
import changeProfilePasswordSaga from './setting/saga';
import logSaga from './transactionlog/saga';

export default function* rootSaga(): any {
    yield all([
        authSaga(),
        layoutSaga(),
        dashboardSaga(),
        roleSaga(),
        warehouseSaga(),
        locationSaga(),
        inventorySaga(),
        userSaga(),
        customerSaga(),
        supplierSaga(),
        stockSaga(),
        stockInSaga(),
        dispatchSaga(),
        reportSaga(),
        notificationSaga(),
        changeProfilePasswordSaga(),
        logSaga(),
    ]);
}
