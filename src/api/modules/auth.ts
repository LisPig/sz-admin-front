import http from '@/api';
import { ADMIN_MODULE } from '@/api/helper/prefix';

/**
 * 认证申请列表
 * @param params
 * @returns {*}
 */
export const getAuthList = (params: any) => {
  return http.get(ADMIN_MODULE + `/miniUser/auth/applications`, params);
};

/**
 * 认证审批
 * @param params
 * @returns {*}
 */
export const authApply = (params: any) => {
  return http.post(ADMIN_MODULE + `/miniUser/auth/review`, params);
};