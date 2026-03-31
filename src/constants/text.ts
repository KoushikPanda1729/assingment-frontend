export const text = {
  app: {
    name: 'VidSense',
    tagline: 'Upload. Analyze. Stream.',
  },

  nav: {
    dashboard: 'Dashboard',
    upload: 'Upload',
    library: 'Library',
    users: 'Users',
    settings: 'Settings',
    logout: 'Logout',
  },

  auth: {
    login: {
      title: 'Welcome back',
      subtitle: 'Sign in to continue to VidSense',
      button: 'Sign In',
      switchText: "Don't have an account?",
      switchLink: 'Sign up',
      forgotPassword: 'Forgot password?',
    },
    register: {
      title: 'Create account',
      subtitle: 'Start managing your videos today',
      button: 'Create Account',
      switchText: 'Already have an account?',
      switchLink: 'Sign in',
    },
    fields: {
      name: 'Full Name',
      email: 'Email address',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      role: 'Role',
      namePlaceholder: 'John Doe',
      emailPlaceholder: 'you@example.com',
      passwordPlaceholder: '••••••••',
    },
  },

  dashboard: {
    title: 'Dashboard',
    subtitle: "Here's what's happening with your videos",
    stats: {
      total: 'Total Videos',
      safe: 'Safe',
      flagged: 'Flagged',
      processing: 'Processing',
    },
    recentUploads: 'Recent Uploads',
    processingQueue: 'Processing Queue',
    noVideos: 'No videos yet',
    noVideosSubtext: 'Upload your first video to get started',
  },

  upload: {
    title: 'Upload Video',
    subtitle: 'Upload a video for sensitivity analysis',
    dropzone: {
      title: 'Drop your video here',
      subtitle: 'or click to browse files',
      formats: 'MP4, MOV, AVI, MKV up to 2GB',
    },
    form: {
      title: 'Video Title',
      titlePlaceholder: 'Enter a title for your video',
      description: 'Description',
      descriptionPlaceholder: 'Optional description...',
      button: 'Upload Video',
    },
    progress: {
      uploading: 'Uploading...',
      processing: 'Analyzing content...',
      done: 'Upload complete!',
      error: 'Upload failed',
    },
  },

  library: {
    title: 'Video Library',
    subtitle: 'All your uploaded videos',
    filters: {
      all: 'All',
      safe: 'Safe',
      flagged: 'Flagged',
      processing: 'Processing',
    },
    empty: 'No videos found',
    emptySubtext: 'Try a different filter or upload a new video',
    search: 'Search videos...',
  },

  video: {
    status: {
      safe: 'Safe',
      flagged: 'Flagged',
      processing: 'Processing',
      pending: 'Pending',
    },
    actions: {
      play: 'Play',
      delete: 'Delete',
      download: 'Download',
    },
  },

  errors: {
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email',
    passwordMin: 'Password must be at least 8 characters',
    passwordMatch: 'Passwords do not match',
    generic: 'Something went wrong. Please try again.',
    unauthorized: 'You are not authorized to perform this action',
  },

  common: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    confirm: 'Confirm',
    back: 'Back',
    viewAll: 'View all',
  },
}
