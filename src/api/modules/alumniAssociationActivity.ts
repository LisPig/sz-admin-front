import http from '@/api';
import { ADMIN_MODULE } from '@/api/helper/prefix';

/**
 * 校友会活动列表
 * @param params
 * @returns {*}
 */
export const getAlumniActivityList = (params: any) => {
  return http.get(ADMIN_MODULE + `/applet-alumni-association-activity`, params);
};

/**
 * 活动申请审批
 * @param params
 * @returns {*}
 */
export const applyAlumniActivity = (params: any) => {
  return http.put(ADMIN_MODULE + `/applet-alumni-association-activity`, params);
};