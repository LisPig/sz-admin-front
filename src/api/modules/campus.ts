import http from '@/api';
import { ADMIN_MODULE } from '@/api/helper/prefix';

/**
 * 获取列表
 * @param params
 * @returns {*}
 */
export const getCampusList = (params: any) => {
  return http.get(ADMIN_MODULE + `/school-album`, params);
};

/**
 * 添加
 * @param params
 * @returns {*}
 */
export const addCampus = (params: any) => {
  return http.post(ADMIN_MODULE + `/school-album`, params);
};

/**
 * 修改
 * @param params
 * @returns {*}
 */
export const editCampus = (params: any) => {
  return http.put(ADMIN_MODULE + `/school-album`, params);
};

/**
 * 删除
 * @param params
 * @returns {*}
 */
export const deleteCampus = (params: { ids: number[] }) => {
  return http.delete(ADMIN_MODULE + `/school-album`, params);
};



/**
 * 获取子图列表
 * @param params
 * @returns {*}
 */
export const getCampusChildList = (params: any) => {
  return http.get(ADMIN_MODULE + `/schoolAlbumChild/page`, params);
};

/**
 * 添加子图
 * @param params
 * @returns {*}
 */
export const addCampusChild= (params: any) => {
  return http.post(ADMIN_MODULE + `/schoolAlbumChild/save`, params);
};

/**
 * 修改子图
 * @param params
 * @returns {*}
 */
export const editCampusChild = (params: any) => {
  return http.put(ADMIN_MODULE + `/schoolAlbumChild/update`, params);
};

/**
 * 删除子图
 * @param params
 * @returns {*}
 */
export const deleteCampusChild = (params: { ids: number[] }) => {
  return http.delete(ADMIN_MODULE + `/schoolAlbumChild/remove`, params);
};