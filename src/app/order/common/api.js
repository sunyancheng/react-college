import request from 'common/request'
export const api = {
  orderActivityDetail: (criteria) => request('/misc/order/user/order/activity-detail', criteria, 'get'),
  orderCreateOrder: (criteria) => request('/misc/order/user/order/create', criteria, 'post'),
  orderPayOptions: (criteria) => request('/misc/order/user/pay/get-pay-code-list', criteria, 'get'),
  orderPay: (criteria) => request('/misc/order/user/pay/pay', criteria, 'post'),
  orderDetail: (criteria) => request('/misc/order/user/pay/order-detail', criteria, 'get'),
  orderGetResult: (criteria) => request('/misc/order/api/notify/return', criteria, 'get'),
  orderZfb: (criteria) => request('/misc/order/user/pay/pay', criteria, 'get')
}

export default api

