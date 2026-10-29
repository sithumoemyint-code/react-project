import type { ComponentType } from 'react'
import type { IconType } from 'react-icons'
import {
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlinePhotograph,
  HiOutlineTemplate,
  HiOutlineUserGroup,
  HiOutlineViewGrid,
} from 'react-icons/hi'
import { RiTestTubeFill } from 'react-icons/ri'
import { Activity } from '@/pages/Activity/Activity'
import { Dashboard } from '@/pages/Dashboard/Dashboard'
import { Media } from '@/pages/Media/Media'
import { Post } from '@/pages/Post/Post'
import { PostNew } from '@/pages/PostNew/PostNew'
import { Taxonomies } from '@/pages/Taxonomies/Taxonomies'
import Testing from '@/pages/Testing/presentation/pages/Testing'
import { Users } from '@/pages/Users/Users'

export type PageMeta = {
  eyebrow: string
  title: string
  description: string
}

export type AppRoute = {
  /** Absolute path used by NavLink and page meta lookup. */
  path: string
  /** Relative path for React Router (empty string = index route). */
  routePath: string
  label: string
  icon?: IconType
  end?: boolean
  /** Show in the sidebar. Defaults to true when `icon` is set. */
  showInSidebar?: boolean
  element: ComponentType
  meta: PageMeta
}

/**
 * Single source of truth for dashboard pages.
 * Add or remove a page here — sidebar, routes, and topbar meta all update together.
 */
export const appRoutes: AppRoute[] = [
  {
    path: '/',
    routePath: '',
    label: 'Dashboard',
    icon: HiOutlineViewGrid,
    end: true,
    element: Dashboard,
    meta: {
      eyebrow: 'Dashboard',
      title: 'Welcome to Mytel Developer CMS!',
      description: 'Manage, edit, and organize all your website articles in one place',
    },
  },
  {
    path: '/posts',
    routePath: 'posts',
    label: 'Posts',
    icon: HiOutlineDocumentText,
    element: Post,
    meta: {
      eyebrow: 'Posts',
      title: 'Content Posts',
      description: 'Create, edit, and publish developer content.',
    },
  },
  {
    path: '/posts/new',
    routePath: 'posts/new',
    label: 'New Post',
    showInSidebar: false,
    element: PostNew,
    meta: {
      eyebrow: 'Posts',
      title: 'New Post',
      description: 'Draft a new content post for the developer platform.',
    },
  },
  {
    path: '/taxonomies',
    routePath: 'taxonomies',
    label: 'Categories',
    icon: HiOutlineTemplate,
    element: Taxonomies,
    meta: {
      eyebrow: 'Categories',
      title: 'Categories',
      description: 'Organize content with taxonomies and categories.',
    },
  },
  {
    path: '/media',
    routePath: 'media',
    label: 'Media Library',
    icon: HiOutlinePhotograph,
    element: Media,
    meta: {
      eyebrow: 'Media Library',
      title: 'Media Library',
      description: 'Upload and manage images and other media assets.',
    },
  },
  {
    path: '/users',
    routePath: 'users',
    label: 'Users',
    icon: HiOutlineUserGroup,
    element: Users,
    meta: {
      eyebrow: 'Users',
      title: 'CMS Users',
      description: 'Manage admin accounts and workspace access.',
    },
  },
  {
    path: '/activity',
    routePath: 'activity',
    label: 'Activity Logs',
    icon: HiOutlineClock,
    element: Activity,
    meta: {
      eyebrow: 'Activity Logs',
      title: 'Activity Logs',
      description: 'Review recent workspace events and audit history.',
    },
  },
  {
    path: '/testing',
    routePath: 'testing',
    label: 'Testing',
    icon: RiTestTubeFill,
    element: Testing,
    meta: {
      eyebrow: 'Testing',
      title: 'Testing Logs',
      description: 'Testing with shadcn and react hook form.',
    },
  },
]

export const menuItems = appRoutes
  .filter((route) => route.showInSidebar !== false && route.icon)
  .map((route) => ({
    to: route.path,
    label: route.label,
    icon: route.icon!,
    end: route.end,
  }))

export const pageMeta: Record<string, PageMeta> = Object.fromEntries(
  appRoutes.map((route) => [route.path, route.meta]),
)
