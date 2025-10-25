import http from '@/api';
import { ADMIN_MODULE } from '@/api/helper/prefix';

/**
 * 获取列表
 * @param params
 * @returns {*}
 */
export const getMasterList = (params: any) => {
  return http.get(ADMIN_MODULE + `/school-master`, params);
};

/**
 * 添加
 * @param params
 * @returns {*}
 */
export const addMaster = (params: any) => {
  return http.post(ADMIN_MODULE + `/school-master`, params);
};

/**
 * 修改
 * @param params
 * @returns {*}
 */
export const editMaster = (params: any) => {
  return http.put(ADMIN_MODULE + `/school-master`, params);
};

/**
 * 删除
 * @param params
 * @returns {*}
 */
export const deleteMaster = (params: { ids: number[] }) => {
  return http.delete(ADMIN_MODULE + `/school-master`, params);
};