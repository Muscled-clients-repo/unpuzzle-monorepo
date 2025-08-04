/**
 * Header Component with Right Sidebar User Panel
 * Provides full functionality matching the React implementation
 */

(function() {
  'use strict';

  // Navigation data
  const navigation = {
    student: [
      { name: 'Home', href: '/', iconClass: 'icon-home' },
      { name: 'Courses', href: '/courses', iconClass: 'icon-book-open' },
      { name: 'My Courses', href: '/my-courses', iconClass: 'icon-academic-cap' },
      { name: 'Puzzle Content', href: '/puzzle-content', iconClass: 'icon-puzzle' },
      { name: 'Settings', href: '/settings', iconClass: 'icon-cog' }
    ]
  };

  // Header class definition
  class Header {
    constructor(options = {}) {
      this.variant = options.variant || 'student';
      this.mobileMenuOpen = false;
      this.sidebarOpen = false;
      this.searchQuery = '';
      this.currentPath = window.location.pathname;
      this.user = options.user || null;
      
      // Cache DOM elements
      this.elements = {
        header: null,
        mobileMenu: null,
        mobileMenuToggle: null,
        menuOpenIcon: null,
        menuCloseIcon: null,
        searchForm: null,
        searchInput: null,
        mobileSearchForm: null,
        mobileSearchInput: null,
        navItems: [],
        mobileNavItems: [],
        userProfileBtn: null,
        userSidebar: null,
        sidebarBackdrop: null,
        closeSidebarBtn: null,
        sidebarSignOutBtn: null,
        mobileSignOutBtn: null,
        notificationBtn: null,
        notificationIndicator: null
      };
      
      this.init();
    }

    init() {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setup());
      } else {
        this.setup();
      }
    }

    async setup() {
      this.cacheElements();
      this.bindEvents();
      this.updateActiveNavigation();
      this.closeMobileMenuOnRouteChange();
      await this.initializeClerkAuth();
      this.setupNotifications();
    }

    cacheElements() {
      this.elements.header = document.getElementById('main-header');
      this.elements.mobileMenu = document.getElementById('mobile-menu');
      this.elements.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
      this.elements.menuOpenIcon = document.getElementById('menu-open-icon');
      this.elements.menuCloseIcon = document.getElementById('menu-close-icon');
      this.elements.searchForm = document.getElementById('search-form');
      this.elements.searchInput = document.getElementById('search-input');
      this.elements.mobileSearchForm = document.getElementById('mobile-search-form');
      this.elements.mobileSearchInput = document.getElementById('mobile-search-input');
      this.elements.navItems = document.querySelectorAll('[data-nav-item]');
      this.elements.mobileNavItems = document.querySelectorAll('[data-mobile-nav-item]');
      this.elements.userProfileBtn = document.getElementById('user-profile-btn');
      this.elements.userSidebar = document.getElementById('user-sidebar');
      this.elements.sidebarBackdrop = document.getElementById('sidebar-backdrop');
      this.elements.closeSidebarBtn = document.getElementById('close-sidebar-btn');
      this.elements.sidebarSignOutBtn = document.getElementById('sidebar-sign-out-btn');
      this.elements.mobileSignOutBtn = document.getElementById('mobile-sign-out-btn');
      this.elements.notificationBtn = document.getElementById('notification-btn');
      this.elements.notificationIndicator = document.getElementById('notification-indicator');
    }

    bindEvents() {
      // Mobile menu toggle
      if (this.elements.mobileMenuToggle) {
        this.elements.mobileMenuToggle.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleMobileMenu();
        });
      }

      // User profile button - opens sidebar
      if (this.elements.userProfileBtn) {
        this.elements.userProfileBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.openSidebar();
        });
      }

      // Close sidebar button
      if (this.elements.closeSidebarBtn) {
        this.elements.closeSidebarBtn.addEventListener('click', () => {
          this.closeSidebar();
        });
      }

      // Backdrop click closes sidebar
      if (this.elements.sidebarBackdrop) {
        this.elements.sidebarBackdrop.addEventListener('click', () => {
          this.closeSidebar();
        });
      }

      // Search form submissions
      if (this.elements.searchForm) {
        this.elements.searchForm.addEventListener('submit', (e) => {
          this.handleSearch(e, this.elements.searchInput);
        });
      }

      if (this.elements.mobileSearchForm) {
        this.elements.mobileSearchForm.addEventListener('submit', (e) => {
          this.handleSearch(e, this.elements.mobileSearchInput);
        });
      }

      // Search input changes
      if (this.elements.searchInput) {
        this.elements.searchInput.addEventListener('input', (e) => {
          this.searchQuery = e.target.value;
        });
      }

      if (this.elements.mobileSearchInput) {
        this.elements.mobileSearchInput.addEventListener('input', (e) => {
          this.searchQuery = e.target.value;
        });
      }

      // Sign out buttons
      if (this.elements.sidebarSignOutBtn) {
        this.elements.sidebarSignOutBtn.addEventListener('click', () => {
          this.handleSignOut();
        });
      }

      if (this.elements.mobileSignOutBtn) {
        this.elements.mobileSignOutBtn.addEventListener('click', () => {
          this.handleSignOut();
        });
      }

      // Notification button
      if (this.elements.notificationBtn) {
        this.elements.notificationBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.handleNotificationClick();
        });
      }

      // Close mobile menu when clicking outside
      document.addEventListener('click', (e) => {
        if (this.mobileMenuOpen && 
            this.elements.mobileMenu &&
            !this.elements.mobileMenu.contains(e.target) && 
            !this.elements.mobileMenuToggle.contains(e.target)) {
          this.closeMobileMenu();
        }
      });

      // Handle ESC key to close menus
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (this.sidebarOpen) {
            this.closeSidebar();
          } else if (this.mobileMenuOpen) {
            this.closeMobileMenu();
          }
        }
      });

      // Handle window resize
      window.addEventListener('resize', () => {
        // Close mobile menu on desktop resize
        if (window.innerWidth >= 768 && this.mobileMenuOpen) {
          this.closeMobileMenu();
        }
      });
    }

    // Sidebar Methods
    openSidebar() {
      this.sidebarOpen = true;
      
      // Show backdrop
      if (this.elements.sidebarBackdrop) {
        this.elements.sidebarBackdrop.classList.remove('hidden');
        requestAnimationFrame(() => {
          this.elements.sidebarBackdrop.classList.add('opacity-100');
        });
      }
      
      // Slide in sidebar
      if (this.elements.userSidebar) {
        this.elements.userSidebar.classList.remove('translate-x-full');
        this.elements.userSidebar.classList.add('translate-x-0');
      }
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    closeSidebar() {
      this.sidebarOpen = false;
      
      // Hide backdrop
      if (this.elements.sidebarBackdrop) {
        this.elements.sidebarBackdrop.classList.remove('opacity-100');
        setTimeout(() => {
          this.elements.sidebarBackdrop.classList.add('hidden');
        }, 300);
      }
      
      // Slide out sidebar
      if (this.elements.userSidebar) {
        this.elements.userSidebar.classList.remove('translate-x-0');
        this.elements.userSidebar.classList.add('translate-x-full');
      }
      
      // Restore body scroll
      document.body.style.overflow = '';
    }

    // Mobile Menu Methods
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
      
      if (this.mobileMenuOpen) {
        this.openMobileMenu();
      } else {
        this.closeMobileMenu();
      }
    }

    openMobileMenu() {
      if (this.elements.mobileMenu) {
        this.elements.mobileMenu.classList.remove('hidden');
        requestAnimationFrame(() => {
          this.elements.mobileMenu.classList.add('mobile-menu-open');
        });
      }
      
      if (this.elements.menuOpenIcon) {
        this.elements.menuOpenIcon.classList.add('hidden');
      }
      
      if (this.elements.menuCloseIcon) {
        this.elements.menuCloseIcon.classList.remove('hidden');
      }
      
      if (this.elements.mobileMenuToggle) {
        this.elements.mobileMenuToggle.setAttribute('aria-expanded', 'true');
      }
      
      document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
      this.mobileMenuOpen = false;
      
      if (this.elements.mobileMenu) {
        this.elements.mobileMenu.classList.add('hidden');
        this.elements.mobileMenu.classList.remove('mobile-menu-open');
      }
      
      if (this.elements.menuOpenIcon) {
        this.elements.menuOpenIcon.classList.remove('hidden');
      }
      
      if (this.elements.menuCloseIcon) {
        this.elements.menuCloseIcon.classList.add('hidden');
      }
      
      if (this.elements.mobileMenuToggle) {
        this.elements.mobileMenuToggle.setAttribute('aria-expanded', 'false');
      }
      
      document.body.style.overflow = '';
    }

    handleSearch(e, inputElement) {
      e.preventDefault();
      
      const query = inputElement ? inputElement.value.trim() : this.searchQuery.trim();
      
      if (query) {
        window.location.href = `/courses?search=${encodeURIComponent(query)}`;
      }
    }

    updateActiveNavigation() {
      const currentPath = window.location.pathname;
      
      // Update desktop navigation
      this.elements.navItems.forEach(item => {
        const href = item.getAttribute('href');
        const isActive = this.isPathActive(currentPath, href);
        
        item.classList.remove(
          'text-blue-600', 'bg-blue-50',
          'text-gray-700', 'hover_text-blue-600', 'hover_bg-gray-50'
        );
        
        if (isActive) {
          item.classList.add('text-blue-600', 'bg-blue-50');
        } else {
          item.classList.add('text-gray-700', 'hover_text-blue-600', 'hover_bg-gray-50');
        }
      });
      
      // Update mobile navigation
      this.elements.mobileNavItems.forEach(item => {
        const href = item.getAttribute('href');
        const isActive = this.isPathActive(currentPath, href);
        
        item.classList.remove(
          'text-blue-600', 'bg-blue-50',
          'text-gray-700', 'hover_text-blue-600', 'hover_bg-gray-50'
        );
        
        if (isActive) {
          item.classList.add('text-blue-600', 'bg-blue-50');
        } else {
          item.classList.add('text-gray-700', 'hover_text-blue-600', 'hover_bg-gray-50');
        }
      });
    }

    isPathActive(currentPath, href) {
      return currentPath === href || (href !== '/' && currentPath.startsWith(href));
    }

    closeMobileMenuOnRouteChange() {
      window.addEventListener('popstate', () => {
        this.closeMobileMenu();
        this.closeSidebar();
        this.updateActiveNavigation();
      });
      
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (link && link.getAttribute('href').startsWith('/')) {
          this.closeMobileMenu();
        }
      });
    }

    // Clerk Authentication Integration
    async initializeClerkAuth() {
      if (window.Clerk) {
        try {
          await window.Clerk.load();
          
          const user = window.Clerk.user;
          if (user) {
            this.user = {
              id: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              firstName: user.firstName,
              lastName: user.lastName,
              image_url: user.profileImageUrl,
              role: user.publicMetadata?.role || 'student',
              created_at: user.createdAt
            };
            
            this.updateUserDisplay();
          }
          
          window.Clerk.addListener(({ user }) => {
            if (user) {
              this.user = {
                id: user.id,
                email: user.primaryEmailAddress?.emailAddress,
                firstName: user.firstName,
                lastName: user.lastName,
                image_url: user.profileImageUrl,
                role: user.publicMetadata?.role || 'student',
                created_at: user.createdAt
              };
            } else {
              this.user = null;
            }
            this.updateUserDisplay();
          });
        } catch (error) {
          console.error('Error initializing Clerk:', error);
        }
      }
    }

    updateUserDisplay() {
      // This would update the user display dynamically if needed
      console.log('User updated:', this.user);
    }

    async handleSignOut() {
      this.closeSidebar();
      
      if (window.Clerk) {
        try {
          await window.Clerk.signOut();
          window.location.href = '/';
        } catch (error) {
          console.error('Error signing out:', error);
          window.location.href = '/api/user-auth/logout';
        }
      } else {
        window.location.href = '/api/user-auth/logout';
      }
    }

    // Notifications
    setupNotifications() {
      // Only check notifications if the endpoint exists
      // Comment out or implement when notification API is ready
      // this.checkNotifications();
      // setInterval(() => {
      //   this.checkNotifications();
      // }, 60000);
      
      // For now, hide the notification indicator
      this.updateNotificationIndicator(false);
    }

    async checkNotifications() {
      try {
        const response = await fetch('/api/notifications/unread-count');
        
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.log('Notifications API not available');
          return;
        }
        
        if (response.ok) {
          const data = await response.json();
          this.updateNotificationIndicator(data.count > 0);
        }
      } catch (error) {
        console.log('Notifications check skipped:', error.message);
        // Hide indicator if API is not available
        this.updateNotificationIndicator(false);
      }
    }

    updateNotificationIndicator(hasNotifications) {
      if (this.elements.notificationIndicator) {
        if (hasNotifications) {
          this.elements.notificationIndicator.classList.remove('hidden');
        } else {
          this.elements.notificationIndicator.classList.add('hidden');
        }
      }
    }

    handleNotificationClick() {
      window.location.href = '/notifications';
    }

    destroy() {
      document.body.style.overflow = '';
      this.closeMobileMenu();
      this.closeSidebar();
    }
  }

  // Add smooth animations and responsive CSS
  const style = document.createElement('style');
  style.textContent = `
    /* Sidebar animations */
    #user-sidebar {
      transition: transform 0.3s ease-in-out;
    }
    
    #sidebar-backdrop {
      transition: opacity 0.3s ease-in-out;
    }
    
    .translate-x-full {
      transform: translateX(100%);
    }
    
    .translate-x-0 {
      transform: translateX(0);
    }
    
    .opacity-100 {
      opacity: 1;
    }
    
    .mobile-menu-open {
      animation: slideDown 0.3s ease-out;
    }
    
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    /* Tailwind-like utility classes */
    .hover_text-blue-600:hover { color: rgb(37 99 235); }
    .hover_bg-gray-50:hover { background-color: rgb(249 250 251); }
    .hover_bg-gray-100:hover { background-color: rgb(243 244 246); }
    .hover_bg-gray-200:hover { background-color: rgb(229 231 235); }
    .hover_text-gray-500:hover { color: rgb(107 114 128); }
    .hover_text-gray-600:hover { color: rgb(75 85 99); }
    .hover_text-gray-900:hover { color: rgb(17 24 39); }
    .hover_bg-blue-700:hover { background-color: rgb(29 78 216); }
    .hover_bg-red-700:hover { background-color: rgb(185 28 28); }
    .focus_outline-none:focus { outline: 2px solid transparent; outline-offset: 2px; }
    .focus_ring-2:focus { box-shadow: 0 0 0 2px rgb(59 130 246 / 0.5); }
    .focus_ring-blue-500:focus { box-shadow: 0 0 0 2px rgb(59 130 246 / 0.5); }
    .focus_ring-red-500:focus { box-shadow: 0 0 0 2px rgb(239 68 68 / 0.5); }
    .focus_ring-offset-2:focus { box-shadow: 0 0 0 2px white, 0 0 0 4px rgb(59 130 246 / 0.5); }
    .focus_border-transparent:focus { border-color: transparent; }
    .sm_px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
    .sm_px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
    .sm_block { display: none; }
    .md_flex { display: none; }
    .md_hidden { display: block; }
    .lg_px-8 { padding-left: 2rem; padding-right: 2rem; }
    .lg_block { display: none; }
    
    /* Fixed positioning */
    .fixed { position: fixed; }
    .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
    .top-0 { top: 0; }
    .right-0 { right: 0; }
    .h-full { height: 100%; }
    .w-80 { width: 20rem; }
    .z-40 { z-index: 40; }
    .z-50 { z-index: 50; }
    .bg-black { background-color: rgb(0 0 0); }
    .bg-opacity-50 { opacity: 0.5; }
    .shadow-xl { box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1); }
    
    @media (min-width: 640px) {
      .sm_px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
      .sm_px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
      .sm_block { display: block; }
    }
    
    @media (min-width: 768px) {
      .md_flex { display: flex; }
      .md_hidden { display: none !important; }
    }
    
    @media (min-width: 1024px) {
      .lg_px-8 { padding-left: 2rem; padding-right: 2rem; }
      .lg_block { display: block; }
    }
  `;
  document.head.appendChild(style);

  // Initialize header when DOM is ready
  let headerInstance = null;

  function initHeader(options = {}) {
    if (headerInstance) {
      headerInstance.destroy();
    }
    headerInstance = new Header(options);
    return headerInstance;
  }

  // Auto-initialize with default options
  initHeader();

  // Export for use in other scripts
  if (typeof window !== 'undefined') {
    window.Header = Header;
    window.initHeader = initHeader;
  }

  // Export for module systems
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Header, initHeader };
  }
})();