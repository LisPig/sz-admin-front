import http from '@/api';
import { ADMIN_MODULE } from '@/api/helper/prefix';
import type { IPage } from '@/api/types';

/**
 * 获取banner列表
 * @param params
 * @returns {*}
 */
export const getBannerList = (params: any) => {
  return http.get(ADMIN_MODULE + `/wechat/mini/banner`, params);
};

/**
 * 添加banner
 * @param params
 * @returns {*}
 */
export const addBanner = (params: any) => {
  return http.post(ADMIN_MODULE + `/wechat/mini/banner/add`, params);
};

/**
 * 修改banner
 * @param params
 * @returns {*}
 */
export const editBanner = (params: any) => {
  return http.put(ADMIN_MODULE + `/wechat/mini/banner`, params);
};

/**
 * 删除banner
 * @param params
 * @returns {*}
 */
export const deleteBanner = (params: { ids: number[] }) => {
  return http.delete(ADMIN_MODULE + `/wechat/mini/banner/remove`, params);
};