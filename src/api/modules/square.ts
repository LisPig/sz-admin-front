import http from '@/api';
import { ADMIN_MODULE } from '@/api/helper/prefix';

/**
 * 获取列表
 * @param params
 * @returns {*}
 */
export const getSquareList = (params: any) => {
  return http.get(ADMIN_MODULE + `/manager/square/memo/list`, params);
};

/**
 * 添加
 * @param params
 * @returns {*}
 */
// export const addMaster = (params: any) => {
//   return http.post(ADMIN_MODULE + `/school-master`, params);
// };

/**
 * 修改
 * @param params
 * @returns {*}
 */
export const editSquare = (params: any) => {
  return http.put(ADMIN_MODULE + `/school-master`, params);
};

/**
 * 删除
 * @param params
 * @returns {*}
 */
export const deleteSquare = (params: { ids: number[] }) => {
  return http.delete(ADMIN_MODULE + `/manager/square/memo/remove`, params);
};