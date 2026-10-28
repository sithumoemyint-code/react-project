export  const pageMeta: Record<
  string,
  { eyebrow: string; title: string; description: string }
> = {
  '/': {
    eyebrow: 'Posts',
    title: 'Welcome to Mytel Developer CMS!',
    description: 'Manage, edit, and organize all your website articles in one place',
  },
  '/posts': {
    eyebrow: 'Posts',
    title: 'Content Posts',
    description: 'Create, edit, and publish developer content.',
  },
  '/posts/new': {
    eyebrow: 'Posts',
    title: 'New Post',
    description: 'Draft a new content post for the developer platform.',
  },
  '/taxonomies': {
    eyebrow: 'Categories',
    title: 'Categories',
    description: 'Organize content with taxonomies and categories.',
  },
  '/media': {
    eyebrow: 'Media Library',
    title: 'Media Library',
    description: 'Upload and manage images and other media assets.',
  },
  '/users': {
    eyebrow: 'Users',
    title: 'CMS Users',
    description: 'Manage admin accounts and workspace access.',
  },
  '/activity': {
    eyebrow: 'Activity Logs',
    title: 'Activity Logs',
    description: 'Review recent workspace events and audit history.',
  },
  '/testing': {
    eyebrow: 'Testing Logs',
    title: 'Tesing Logs',
    description: 'Testing with shadcn and react hook form.',
  },
}