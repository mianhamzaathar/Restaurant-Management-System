import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    component: () => import('@/components/auth/Login.vue'),
    meta: { 
      guest: true, 
      title: 'Login',
      layout: 'AuthLayout' 
    }
  },
  {
    path: '/register',
    component: () => import('@/components/auth/Register.vue'),
    meta: { 
      guest: true, 
      title: 'Register',
      layout: 'AuthLayout'
    }
  },
  {
  path: '/',
  component: () => import('@/reports/Dashboard.vue'),
  meta: { 
    requiresAuth: true,
    title: 'Dashboard',
    layout: 'AppLayout'
  },
    children: [
      {
        path: 'menu-items',
        component: () => import('@/components/menu-items/Index.vue'),
        meta: { 
          title: 'Menu Items',
          breadcrumb: 'Menu Items'
        }
      },
      {
        path: 'orders',
        component: () => import('@/components/orders/index.vue'),
        meta: { 
          title: 'Orders',
          breadcrumb: 'Orders'
        }
      },
      {
        path: 'orders/:id',
        component: () => import('@/components/orders/details.vue'),
        meta: { 
          title: 'Order Details',
          breadcrumb: 'Order Details'
        },
        props: true
      },
      {
        path: 'kitchen',
        component: () => import('@/components/orders/kitchen.vue'),
        meta: { 
          title: 'Kitchen Display',
          requiresRole: ['chef', 'manager'],
          breadcrumb: 'Kitchen'
        }
      },
      {
        path: 'reports',
        component: () => import('@/reports/index.vue'),
        meta: { 
          title: 'Reports',
          requiresRole: ['manager', 'admin'],
          breadcrumb: 'Reports'
        }
      }
    ]
  },
  // Fallback route for 404 errors
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Return to saved position or top of page
    return savedPosition || { top: 0 }
  }
})

// Navigation guard for authentication and authorization
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore() // Assuming you're using Pinia
  const isAuthenticated = authStore.token
  const userRole = authStore.user?.role

  // Set document title
  document.title = to.meta.title 
    ? `${to.meta.title} | Restaurant System` 
    : 'Restaurant System'

  // Redirect to login if route requires auth and user is not authenticated
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login')
  }

  // Redirect to dashboard if user is authenticated but tries to access guest-only routes
  if (to.meta.guest && isAuthenticated) {
    return next('/')
  }

  // Check role-based access
  if (to.meta.requiresRole) {
    if (!userRole || !to.meta.requiresRole.includes(userRole)) {
      return next('/')
    }
  }

  next()
})

export default router