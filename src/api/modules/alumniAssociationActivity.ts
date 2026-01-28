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
 * 获取校友会活动详情
 * @param id
 * @returns {*}
 */
export const getAlumniActivityDetail = (id: number) => {
  return http.get(ADMIN_MODULE + `/applet-alumni-association-activity/${id}`);
};

/**
 * 活动申请审批
 * @param params
 * @returns {*}
 */
export const applyAlumniActivity = (params: any) => {
  return http.post(ADMIN_MODULE + `/applet-alumni-association-activity/approve`, params);
};

/**
 * 删除校友会活动
 * @param params
 * @returns {*}
 */
export const deleteAlumniActivity = (params: { ids: number[] }) => {
  return http.delete(ADMIN_MODULE + `/applet-alumni-association-activity`, params);
};