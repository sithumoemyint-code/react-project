import type { IconType } from 'react-icons'
import {
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlinePhotograph,
  HiOutlineTemplate,
  HiOutlineUserGroup,
  HiOutlineViewGrid,
} from 'react-icons/hi'
import { RiTestTubeFill } from "react-icons/ri";

export const menuItems: {
  to: string
  label: string
  icon: IconType
  end?: boolean
}[] = [
  { to: '/', label: 'Dashboard', icon: HiOutlineViewGrid, end: true },
  { to: '/posts', label: 'Posts', icon: HiOutlineDocumentText },
  { to: '/taxonomies', label: 'Categories', icon: HiOutlineTemplate },
  { to: '/media', label: 'Media Library', icon: HiOutlinePhotograph },
  { to: '/users', label: 'Users', icon: HiOutlineUserGroup },
  { to: '/activity', label: 'Activity Logs', icon: HiOutlineClock },
  { to: '/testing', label: 'Testing', icon: RiTestTubeFill },
]
