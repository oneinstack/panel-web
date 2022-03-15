import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout'

/* Router Modules */
// import chartsRouter from './modules/charts'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/Login.vue'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401.vue'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        //using el svg icon, the elSvgIcon first when at the same time using elSvgIcon and icon
        meta: { title: 'Dashboard', elSvgIcon: 'Fold' }
      },
    ]
  },
  {
    path: '/devops',
    component: Layout,
    meta: { title: 'devops', elSvgIcon: 'Tools' },
    children: [
      {
        path: 'env',
        name: 'Env',
        component: () => import('@/views/devops/env.vue'),
        meta: { title: '环境配置', role: 'admin', elSvgIcon: 'Fold'}
      },
      {
            path: 'configKey',
            name: 'configKey',
            component: () => import('@/views/devops/key.vue'),
            meta: { title: 'Key配置', elSvgIcon: 'Fold'}
      },
      {
            path: 'configGlobal',
            name: 'configGlobal',
            component: () => import('@/views/devops/global.vue'),
            meta: { title: '全局配置', role: 'admin', elSvgIcon: 'Fold'}
      },
      {
        path: 'groups',
        name: 'Groups',
        component: () => import('@/views/devops/groups.vue'),
        meta: { title: '项目组配置', role: 'admin', elSvgIcon: 'Fold'}
      },
      {
        path: 'credentials',
        name: 'Credentials',
        component: () => import('@/views/devops/credentials.vue'),
        meta: { title: '凭据配置', role: 'admin', elSvgIcon: 'Fold'}
      }
    ]
  },
  {
    path: '/projects',
    component: Layout,
    meta: { title: 'projects',  elSvgIcon: 'Wallet'},
    children: [
      {
        path: '/project',
        name: 'project',
        component: () => import('@/views/projects/projects.vue'),
        meta: { title: '服务管理', role: 'admin', elSvgIcon: 'Fold'}
      },
      {
        path: '/projectDetail/:id',
        hidden: true,
        name: 'projectDetail',
        component: () => import('@/views/projects/projectDetail.vue'),
        meta: { title: '服务详情', activeMenu: '/project'}
      },
      {
        path: '/projectDeployment',
        name: 'projectDeployment',
        component: () => import('@/views/projects/projectDeployment.vue'),
        meta: { title: '服务发布', role: 'admin',activeMenu: '/projectDeployment', elSvgIcon: 'Fold'}
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    meta: { title: 'setting', elSvgIcon: 'Setting' },
    children: [
      {
        path: 'user',
        component: () => import('@/views/setting/usersetting.vue'),
        name: 'user',
        meta: { title: 'user', elSvgIcon: 'User' }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    hidden: true,
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'roleIndex',
        component: () => import('@/views/permission'),
        name: 'Permission',
        meta: {
          title: 'Role Index'
          //roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'page',
        component: () => import('@/views/permission/page.vue'),
        name: 'PagePermission',
        meta: {
          title: 'Page Permission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive.vue'),
        name: 'DirectivePermission',
        meta: {
          title: 'Directive Permission'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'code-index',
        component: () => import('@/views/permission/CodePermission.vue'),
        name: 'CodePermission',
        meta: {
          title: 'Code Index'
        }
      },
      {
        path: 'code-page',
        component: () => import('@/views/permission/CodePage.vue'),
        name: 'CodePage',
        meta: {
          title: 'Code Page',
          code: 1
        }
      },

      // 404 page must be placed at the end !!!
      // using pathMatch install of "*" in vue-router 4.0
      { path: '/:pathMatch(.*)', redirect: '/404', hidden: true }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: constantRoutes
})

export default router
