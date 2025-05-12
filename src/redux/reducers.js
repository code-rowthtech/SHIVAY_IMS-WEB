// @flow
import { combineReducers } from 'redux';

import Auth from './auth/reducers';

import Layout from './layout/reducers';

import { dashboardDataReducer, dispatchListReducer, lowStockReducer, recentTransactionReducer, stockinTransListReducer, stockReportReducer } from './dashboard/reducers';
import { rolesListReducer } from './roles/reducers';
import { createWarehouseReducer, deleteWarehouseReducer, getWarehouseListReducer, getWarehouseReducer, updateWarehouseReducer } from './warehouse/reducers';
import { locationReducer } from './location/reducers';
import { createProductReducer, deleteProductReducer, productListReducer, searchProductReducer, updateProductReducer, viewProductReducer } from './inventory/reducers';
import { createUsersReducer, deleteUsersReducer, listingUsersReducer, updateUsersReducer, userListReducer } from './users/reducers';
import { createCustomerReducer, customerListReducer, deleteCustomerReducer, listingCustomerReducer, updateCustomerReducer } from './customer/reducers';
import { createSupplierReducer, deleteSupplierReducer, listingSupplierReducer, supplierListReducer, updateSupplierReducer } from './supplier/reducers';
import { createStockProductReducer, createStockReducer, deleteStockProductReducer, stockByIdReducer, stockListReducer, updateStockProductReducer, updateStockReducer } from './openingStock/reducers';
import { createStockInProductReducer, createStockInReducer, deleteStockInProductReducer, deleteStockInReducer, stockInByIdReducer, stockInListReducer, updateStockInProductReducer, updateStockInReducer } from './stockIn/reducers';
import { createDispatchProductReducer, createDispatchReducer, createStockCheckReducer, deleteDispatchProductReducer, deleteDispatchReducer, dispatchByIdReducer, getDispatchDataReducer, updateDispatchProductReducer, updateDispatchReducer } from './dispatch/reducers';
import { reportReducer } from './report/reducers';
import { getNotificationDataReducer } from './notification/reducers';

export default (combineReducers({
  Auth,
  Layout,
  // dashboard 
  dashboardDataReducer, stockinTransListReducer, dispatchListReducer, stockReportReducer, recentTransactionReducer, lowStockReducer,
  // Roles 
  rolesListReducer,
  // warehouse 
  createWarehouseReducer, getWarehouseReducer, updateWarehouseReducer, deleteWarehouseReducer, getWarehouseListReducer,
  // inventory 
  productListReducer, createProductReducer, updateProductReducer, deleteProductReducer, searchProductReducer, viewProductReducer,
  // location
  locationReducer,
  // users 
  userListReducer, createUsersReducer, updateUsersReducer, deleteUsersReducer, listingUsersReducer,
  // Customer 
  customerListReducer, createCustomerReducer, updateCustomerReducer, deleteCustomerReducer, listingCustomerReducer,
  // supplier 
  supplierListReducer, createSupplierReducer, updateSupplierReducer, deleteSupplierReducer, listingSupplierReducer,
  // Stock 
  stockListReducer, createStockReducer, updateStockReducer, updateStockProductReducer, deleteStockProductReducer, stockByIdReducer, createStockProductReducer,
  // stockIn 
  stockInListReducer, createStockInReducer, updateStockInReducer, deleteStockInReducer, stockInByIdReducer, updateStockInProductReducer, deleteStockInProductReducer, createStockInProductReducer,
  // dispatch
  getDispatchDataReducer, createDispatchReducer, updateDispatchReducer, deleteDispatchReducer, createStockCheckReducer, updateDispatchProductReducer, deleteDispatchProductReducer, dispatchByIdReducer, createDispatchProductReducer,
  // report
  reportReducer,
  // notification
  getNotificationDataReducer,

}): any);
