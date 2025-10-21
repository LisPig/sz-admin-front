import http from '@/api';
import { ADMIN_MODULE } from '@/api/helper/prefix';
import type { IPage } from '@/api/types';

/**
 * 获取文章列表
 * @param params
 * @returns {*}
 */
export const getArticleList = (params: any) => {
  return http.get(ADMIN_MODULE + `/wechat/mini/article`, params);
};

/**
 * 添加文章
 * @param params
 * @returns {*}
 */
export const addArticle = (params: any) => {
  return http.post(ADMIN_MODULE + `/wechat/mini/article`, params);
};

/**
 * 修改文章
 * @param params
 * @returns {*}
 */
export const editArticle = (params: any) => {
  return http.put(ADMIN_MODULE + `/wechat/mini/article`, params);
};

/**
 * 删除文章
 * @param params
 * @returns {*}
 */
export const deleteArticle = (params: { ids: number[] }) => {
  return http.delete(ADMIN_MODULE + `/wechat/mini/article`, params);
};