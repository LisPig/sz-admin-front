import http from '@/api';
import { ADMIN_MODULE } from '@/api/helper/prefix';

/**
 * 获取banner列表
 * @param params
 * @returns {*}
 */
export const getSchoolClassMemoryList = (params: any) => {
  return http.get(ADMIN_MODULE + `/school-class-memory`, params);
};

/**
 * 添加banner
 * @param params
 * @returns {*}
 */
export const addSchoolClassMemory = (params: any) => {
  return http.post(ADMIN_MODULE + `/school-class-memory`, params);
};

/**
 * 修改banner
 * @param params
 * @returns {*}
 */
export const editSchoolClassMemory = (params: any) => {
  return http.put(ADMIN_MODULE + `/school-class-memory`, params);
};

/**
 * 删除banner
 * @param params
 * @returns {*}
 */
export const deleteSchoolClassMemory = (params: { ids: number[] }) => {
  return http.delete(ADMIN_MODULE + `/school-class-memory`, params);
};