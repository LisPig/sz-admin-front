import http from '@/api';
import { ADMIN_MODULE } from '@/api/helper/prefix';

/**
 * 校友会列表
 * @param params
 * @returns {*}
 */
export const getAlumniAssociationList = (params: any) => {
  return http.get(ADMIN_MODULE + `/applet-alumni-association`, params);
};

/**
 * 获取校友会详情
 * @param id
 * @returns {*}
 */
export const getAlumniAssociationDetail = (id: number) => {
  return http.get(ADMIN_MODULE + `/applet-alumni-association/info/${id}`);
};

/**
 * 更新校友会信息
 * @param params
 * @returns {*}
 */
export const updateAlumniAssociation = (params: any) => {
  return http.put(ADMIN_MODULE + `/applet-alumni-association`, params);
};

/**
 * 申请审批
 * @param params
 * @returns {*}
 */
export const editAlumniAssociation = (params: any) => {
  return http.post(ADMIN_MODULE + `/applet-alumni-association/approve`, params);
};

/**
 * 删除校友会
 * @param params
 * @returns {*}
 */
export const deleteAlumniAssociation = (params: { ids: number[] }) => {
  return http.delete(ADMIN_MODULE + `/applet-alumni-association`, params);
};