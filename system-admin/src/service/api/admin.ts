import { request } from '../request';

/**
 * 获取用户列表
 */
export function fetchAdminUserList(role?: string) {
  return request({ url: '/admin/users', method: 'get', params: { role } });
}

/**
 * 更新用户状态
 */
export function updateAdminUserStatus(id: string, status: string) {
  return request({ url: `/admin/users/${id}/status`, method: 'put', data: { status } });
}

/**
 * 获取食堂结构 (包含档口)
 */
export function fetchAdminCanteenList() {
  return request({ url: '/canteen', method: 'get' });
}

/**
 * 获取全部订单流水 (Admin 身份下直接返回全部)
 */
export function fetchAdminOrderList() {
  return request({ url: '/order', method: 'get' });
}

/**
 * 获取投诉列表
 */
export function fetchAdminComplaintList() {
  return request({ url: '/complaint', method: 'get' });
}

/**
 * 回复投诉并完结
 */
export function replyAdminComplaint(id: string, reply: string) {
  return request({ url: `/complaint/${id}/reply`, method: 'put', data: { reply } });
}

/**
 * 获取全局公告
 */
export function fetchAdminAnnouncementList() {
  return request({ url: '/announcement', method: 'get' });
}

/**
 * 发布系统公告
 */
export function createAdminAnnouncement(title: string, content: string, authorId: string) {
  return request({ url: '/announcement', method: 'post', data: { title, content, authorId } });
}

/**
 * 撤回/删除公告
 */
export function deleteAdminAnnouncement(id: string) {
  return request({ url: `/announcement/${id}`, method: 'delete' });
}
