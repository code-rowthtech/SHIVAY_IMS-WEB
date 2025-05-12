//Dashboard 
export const GET_DASHBOARD_DATA = '/api/dashboard/get'
export const GET_STOCKIN_LIST = '/api/transaction/stockin/list'
export const GET_DISPATCH_TRANS_LIST = '/api/transaction/dispatch/list'
export const GET_STOCK_REPORT ='/api/dashboard/stockreport'
export const GET_RECENT_TRANSACTION ='/api/dashboard/topselling-recenttransaction/list'
export const GET_LOW_STOCK ='/api/dashboard/lowstock-dispatchcount'

//roles
export const GET_ROLES_LIST = '/api/role/get/list'

// Warehouse 
export const CREATE_WAREHOUSE = '/api/warehouse/add'
export const GET_WAREHOUSE_LIST = 'api/warehouse/get'
export const UPDATE_WAREHOUSE = '/api/warehouse/edit'
export const DELETE_WAREHOUSE = '/api/warehouse/delete'
export const SEARCH_WAREHOUSE = '/api/warehouse/list'

// inventory 
export const GET_PRODUCT_LIST = '/api/product/get'
export const CREATE_PRODUCT = '/api/product/add'
export const UPDATE_PRODUCT = '/api/product/edit'
export const DELETE_PRODUCT = '/api/product/delete'
export const SEARCH_PRODUCT = '/api/product/search'
export const VIEW_PRODUCT = '/api/product/view'

// location 
export const GET_LOCATION = '/api/location/get'

// User
export const GET_USERS_LIST = '/api/user/get'
export const CREATE_USERS = '/api/user/add'
export const UPDATE_USERS = '/api/user/edit'
export const DELETE_USERS = '/api/user/delete'
export const LISTING_USERS = '/api/user/list'

// Customer 
export const GET_CUSTOMER_LIST = '/api/customer/get'
export const CREATE_CUSTOMER = '/api/customer/add'
export const UPDATE_CUSTOMER = '/api/customer/edit'
export const DELETE_CUSTOMER = '/api/customer/delete'
export const LISTING_CUSTOMER = '/api/customer/list'

// Supplier
export const GET_SUPPLIER_LIST = '/api/supplier/get'
export const CREATE_SUPPLIER = '/api/supplier/add'
export const UPDATE_SUPPLIER = '/api/supplier/edit'
export const DELETE_SUPPLIER = '/api/supplier/delete'
export const LISTING_SUPPLIER = '/api/supplier/list'


// Opening Stock
export const GET_STOCK_LIST = '/api/stock/get'
export const CREATE_STOCK = '/api/stock/add'
export const UPDATE_STOCK = '/api/stock/edit'
export const GET_STOCK_BY_ID = '/api/stock'
export const EDIT_STOCK_PRODUCT = '/api/stock/edit/product'
export const DELETE_STOCK_PRODUCT = '/api/stock/delete/product'
export const CREATE_STOCK_PRODUCT = '/api/stock/add/product'

// Stock In
export const GET_STOCKIN_DATA = '/api/stockin/get/supplier-list'
export const CREATE_STOCKIN = '/api/stockIn/add'
export const UPDATE_STOCKIN = '/api/stockIn/edit'
export const DELETE_STOCKIN = '/api/stockIn/delete'
export const GET_STOCKIN_BY_ID = '/api/stockin'
export const EDIT_STOCKIN_PRODUCT = '/api/stockIn/edit/product'
export const DELETE_STOCKIN_PRODUCT = '/api/stockIn/delete/product'
export const CREATE_STOCKIN_PRODUCT = '/api/stockIn/add/product'


// Dispatch
export const GET_DISPATCH = '/api/dispatch/get/customer-list'
export const CREATE_DISPATCH = '/api/dispatch/add'
export const UPDATE_DISPATCH = '/api/dispatch/edit'
export const DELETE_DISPATCH = '/api/dispatch/delete'
export const STOCK_CHECK = '/api/dispatch/stock-check'
export const EDIT_DISPATCH_PRODUCT = '/api/dispatch/edit/product'
export const DELETE_DISPATCH_PRODUCT = '/api/dispatch/delete/product'
export const CREATE_DISPATCH_PRODUCT = '/api/dispatch/add/product'
export const GET_DISPATCH_BY_ID = '/api/dispatch'


// report 
export const GET_REPORT = 'api/report/send'

// notifications 
export const GET_NOTIFICATION = 'api/notification/list'