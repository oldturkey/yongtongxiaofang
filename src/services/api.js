import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

//项目接口
export async function devicebardata() {
  return request('Rapi/dashboard/devicebardata', {
    method: 'POST',
  });
}
//获取设备的deviceName以及所在地理位置表
export async function deviceList() {
  return request('Rapi/dashboard/deviceList', {
    method: 'POST',
  });
}
//通过设备的deviceName名称获取设备的属性值
export async function devicepropsbydevicename(params) {
  return request('Rapi/dashboard/devicepropsbydevicename', {
    method: 'POST',
    body: params,
  });
}
//通过设备的deviceName名称获取设备的属性值
export async function getdevicepropsbytimeanddevicename(params) {
  return request('Rapi/dashboard/getdevicepropsbytimeanddevicename', {
    method: 'POST',
    body: params,
  });
}
//获取联系人信息
export async function getcontacts() {
  return request('Rapi/alert/getcontacts', {
    method: 'POST',
  });
}
//获取设备的报警列表，通过起止时间
export async function getalertlist(params) {
  return request('Rapi/alert/getalertlist', {
    method: 'POST',
    body: params,
  });
}
