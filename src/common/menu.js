import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '主页',
    icon: 'dashboard',
    path: 'dashboard/analysis',
  },
  {
    name: '报警',
    icon: 'bulb',
    path: 'alert',
    children: [
      {
        name: '报警查询',
        path: 'search-alert',
      },
      {
        name: '联系人管理',
        path: 'user-alert',
      },
    ],
  },
  {
    name: '设置',
    icon: 'calculator',
    path: 'property',
    children: [
      {
        name: '设备属性',
        path: 'device-Data',
      },
    ],
  },
  // {
  //   name: '表单页',
  //   icon: 'form',
  //   path: 'form',
  //   children: [
  //     {
  //       name: '基础表单',
  //       path: 'basic-form',
  //     },
  //     {
  //       name: '分步表单',
  //       path: 'step-form',
  //     },
  //     {
  //       name: '高级表单',
  //       authority: 'admin',
  //       path: 'advanced-form',
  //     },
  //   ],
  // },
  // {
  //   name: '列表页',
  //   icon: 'table',
  //   path: 'list',
  //   children: [
  //     {
  //       name: '查询表格',
  //       path: 'table-list',
  //     },
  //     {
  //       name: '标准列表',
  //       path: 'basic-list',
  //     },
  //     {
  //       name: '卡片列表',
  //       path: 'card-list',
  //     },
  //     {
  //       name: '搜索列表',
  //       path: 'search',
  //       children: [
  //         {
  //           name: '搜索列表（文章）',
  //           path: 'articles',
  //         },
  //         {
  //           name: '搜索列表（项目）',
  //           path: 'projects',
  //         },
  //         {
  //           name: '搜索列表（应用）',
  //           path: 'applications',
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   name: '详情页',
  //   icon: 'profile',
  //   path: 'profile',
  //   children: [
  //     {
  //       name: '基础详情页',
  //       path: 'basic',
  //     },
  //     {
  //       name: '高级详情页',
  //       path: 'advanced',
  //       authority: 'admin',
  //     },
  //   ],
  // },
  // {
  //   name: '结果页',
  //   icon: 'check-circle-o',
  //   path: 'result',
  //   children: [
  //     {
  //       name: '成功',
  //       path: 'success',
  //     },
  //     {
  //       name: '失败',
  //       path: 'fail',
  //     },
  //   ],
  // },
  // {
  //   name: '异常页',
  //   icon: 'warning',
  //   path: 'exception',
  //   children: [
  //     {
  //       name: '403',
  //       path: '403',
  //     },
  //     {
  //       name: '404',
  //       path: '404',
  //     },
  //     {
  //       name: '500',
  //       path: '500',
  //     },
  //     {
  //       name: '触发异常',
  //       path: 'trigger',
  //       hideInMenu: true,
  //     },
  //   ],
  // },
  // {
  //   name: '账户',
  //   icon: 'user',
  //   path: 'user',
  //   authority: 'guest',
  //   children: [
  //     {
  //       name: '登录',
  //       path: 'login',
  //     },
  //     {
  //       name: '注册',
  //       path: 'register',
  //     },
  //     {
  //       name: '注册结果',
  //       path: 'register-result',
  //     },
  //   ],
  // },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
