import http from '@/api';
import { ADMIN_MODULE } from '@/api/helper/prefix';

/**
 * 申请列表
 * @param params
 * @returns {*}
 */
export const getAlumniCardList = (params: any) => {
  return http.get(ADMIN_MODULE + `/appletAlumniPassApplication/page`, params);
};

/**
 * 审批
 * @param params
 * @returns {*}
 */
export const alumniCardApply = (params: any) => {
  return http.post(ADMIN_MODULE + `/appletAlumniPassApplication/approve`, params);
};