// src/constants/menuItems.ts

import { getUserFromSession } from "../helpers/api/apiCore";

const Role = getUserFromSession()?.user?.role?.name;

const RAW_MENU_ITEMS = [
    { key: 'navigation', label: 'Navigation', isTitle: true },
    {
        key: 'dashboard',
        label: 'Dashboard',
        isTitle: false,
        icon: 'uil-dashboard',
        url: '/shivay/dashboard',
    },
    {
        key: 'inventory',
        label: 'Product',
        isTitle: false,
        icon: ' uil-shopping-cart-alt',
        url: '/shivay/inventory',
    },
    {
        key: 'report',
        label: 'Report',
        isTitle: false,
        icon: ' uil-clipboard-alt',
        url: '/shivay/report',
    },
    {
        key: 'user',
        label: 'User',
        isTitle: false,
        icon: ' uil-user-square',
        url: '/shivay/user',
    },
    {
        key: 'warehouse',
        label: 'Warehouse',
        isTitle: false,
        icon: ' uil-store',
        url: '/shivay/warehouse',
    },
    {
        key: 'openingStock',
        label: 'Opening Stock',
        isTitle: false,
        icon: ' uil-bell',
        url: '/shivay/openingStock',
    },
    {
        key: 'stockIn',
        label: 'Stock In',
        isTitle: false,
        icon: 'uil-file-check-alt',
        url: '/shivay/stockIn',
    },
    {
        key: 'dispatch',
        label: 'Dispatch',
        isTitle: false,
        icon: ' uil-file-block-alt',
        url: '/shivay/dispatch',
    },
    {
        key: 'customer',
        label: 'Customer',
        isTitle: false,
        icon: ' uil-users-alt',
        url: '/shivay/customer',
    },
    {
        key: 'supplier',
        label: 'Supplier',
        isTitle: false,
        icon: ' uil-truck',
        url: '/shivay/supplier',
    },
];

const MENU_ITEMS = Role === 'admin'
    ? RAW_MENU_ITEMS
    : RAW_MENU_ITEMS.filter(item => !['user', 'openingStock', 'warehouse'].includes(item.key));

export default MENU_ITEMS;
