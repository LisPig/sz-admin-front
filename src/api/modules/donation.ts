import http from '@/api';
import { ADMIN_MODULE } from '@/api/helper/prefix';

/**
 * 获取列表
 * @param params
 * @returns {*}
 */
export const getDonaProjectList = (params: any) => {
  return http.get(ADMIN_MODULE + `/donation-project`, params);
};

/**
 * 添加
 * @param params
 * @returns {*}
 */
export const addDonaProject = (params: any) => {
  return http.post(ADMIN_MODULE + `/donation-project`, params);
};

/**
 * 修改
 * @param params
 * @returns {*}
 */
export const editDonaProject = (params: any) => {
  return http.put(ADMIN_MODULE + `/donation-project`, params);
};

/**
 * 删除
 * @param params
 * @returns {*}
 */
export const deleteDonaProject = (params: { ids: number[] }) => {
  return http.delete(ADMIN_MODULE + `/donation-project`, params);
};