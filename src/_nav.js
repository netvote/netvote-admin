export default {
  items: [
    // {
    //   name: 'Dashboard',
    //   url: '/dashboard',
    //   icon: 'icon-speedometer'
    // },
    // {
    //   title: true,
    //   name: 'Netvote',
    //   wrapper: {
    //     element: '',
    //     attributes: {},
    //   },
    // },
    // {
    //   name: 'Usage',
    //   url: '/usage',
    //   icon: 'icon-chart',
    // },
    // {
    //   name: 'API Keys',
    //   url: '/apikeys',
    //   icon: 'fa fa-key',
    // },
    {
      title: true,
      name: 'Products',
      wrapper: {
        element: '',
        attributes: {},
      },
    },
    {
      name: 'Netvote',
      icon: 'fa fa-check-square-o',
      wrapper: {
        element: '',
        attributes: {},
      },
      children: [
        {
          name: 'Usage',
          url: '/usage',
          icon: 'icon-chart',
        },
        {
          name: 'API Keys',
          url: '/apikeys',
          icon: 'fa fa-key',
        },
        {
          name: 'Documentation',
          url: 'https://doc.netvote.io',
          icon: 'fa fa-book',
        }
      ],
    },
    {
      divider: true,
    },
    {
      name: 'Netrosa',
      icon: 'fa fa-file-text-o',
      wrapper: {
        element: '',
        attributes: {},
      },
      children: [
        {
          name: 'Usage',
          url: '/netrosausage',
          icon: 'icon-chart',
        },
        {
          name: 'API Keys',
          url: '/netrosaapikeys',
          icon: 'fa fa-key',
        },
      ],
    },

    {
      divider: true,
    },
    // {
    //   name: 'Usage',
    //   icon: 'icon-chart',
    //   children: [
    //     {
    //       name: 'Netvote',
    //       url: '/usage',
    //       icon: 'icon-chart',
    //     },
    //     {
    //       name: 'Netrosa',
    //       url: '/netrosausage',
    //       icon: 'icon-chart',
    //     },

    //   ],
    // },
    // {
    //   title: true,
    //   name: 'Usage',
    //   wrapper: {            // optional wrapper object
    //     element: '',        // required valid HTML5 element tag
    //     attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
    //   },
    //   class: ''             // optional class names space delimited list for title item ex: "text-center"
    // },
    // {
    //   name: 'Netvote Usage',
    //   url: '/usage',
    //   icon: 'icon-chart',
    // },
    // {
    //   title: true,
    //   name: 'Configuration',
    //   wrapper: {
    //     element: '',
    //     attributes: {},
    //   },
    // },
    // {
    //   name: 'API Keys',

    //   icon: 'fa fa-key',
    //   children: [
    //     {
    //       name: 'Netvote',
    //       url: '/apikeys',
    //       icon: 'fa fa-key',
    //     },
    //     {
    //       name: 'Netrosa',
    //       url: '/netrosaapikeys',
    //       icon: 'fa fa-key',
    //     },

    //   ],
    // },
    // {
    //   divider: true,
    // },
    // {
    //   title: true,
    //   name: 'Documentation',
    //   wrapper: {
    //     element: '',
    //     attributes: {},
    //   },
    // },
    // {
    //   name: 'Netvote',
    //   url: 'https://doc.netvote.io',
    //   icon: 'fa fa-book',
    // },
    // {
    //   name: 'Documentation',

    //   icon: 'fa fa-book',
    //   children: [
    //     {
    //       name: 'Netvote',
    //       url: 'https://doc.netvote.io',
    //       icon: 'fa fa-book',
    //       attributes: { target: "_blank", rel: "noopener noreferrer" },
    //     },
    //   ],
    // }, 
    // {
    //   title: true,
    //   name: 'Examples',
    //   wrapper: {
    //     element: '',
    //     attributes: {},
    //   },
    // },
    // {
    //   name: 'Base',
    //   icon: 'icon-puzzle',
    //   children: [
    //     {
    //       name: 'Cards',
    //       url: '/base/cards',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Collapses',
    //       url: '/base/collapses',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Dropdowns',
    //       url: '/base/dropdowns',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Jumbotrons',
    //       url: '/base/jumbotrons',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'List groups',
    //       url: '/base/list-groups',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Navs',
    //       url: '/base/navs',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Paginations',
    //       url: '/base/paginations',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Popovers',
    //       url: '/base/popovers',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Progress Bar',
    //       url: '/base/progress-bar',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Switches',
    //       url: '/base/switches',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Tabs',
    //       url: '/base/tabs',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Tooltips',
    //       url: '/base/tooltips',
    //       icon: 'icon-puzzle',
    //     },
    //   ],
    // },
    // {
    //   name: 'Buttons',
    //   url: '/buttons',
    //   icon: 'icon-cursor',
    //   children: [
    //     {
    //       name: 'Buttons',
    //       url: '/buttons/buttons',
    //       icon: 'icon-cursor',
    //     },
    //     {
    //       name: 'Button dropdowns',
    //       url: '/buttons/button-dropdowns',
    //       icon: 'icon-cursor',
    //     },
    //     {
    //       name: 'Button groups',
    //       url: '/buttons/button-groups',
    //       icon: 'icon-cursor',
    //     },
    //     {
    //       name: 'Brand Buttons',
    //       url: '/buttons/brand-buttons',
    //       icon: 'icon-cursor',
    //     },
    //   ],
    // },
    // {
    //   name: 'Icons',
    //   url: '/icons',
    //   icon: 'icon-star',
    //   children: [
    //     {
    //       name: 'CoreUI Icons',
    //       url: '/icons/coreui-icons',
    //       icon: 'icon-star'
    //     },
    //     {
    //       name: 'Flags',
    //       url: '/icons/flags',
    //       icon: 'icon-star',
    //     },
    //     {
    //       name: 'Font Awesome',
    //       url: '/icons/font-awesome',
    //       icon: 'icon-star',
    //       badge: {
    //         variant: 'secondary',
    //         text: '4.7',
    //       },
    //     },
    //     {
    //       name: 'Simple Line Icons',
    //       url: '/icons/simple-line-icons',
    //       icon: 'icon-star',
    //     },
    //   ],
    // },
    // {
    //   name: 'Notifications',
    //   url: '/notifications',
    //   icon: 'icon-bell',
    //   children: [
    //     {
    //       name: 'Alerts',
    //       url: '/notifications/alerts',
    //       icon: 'icon-bell',
    //     },
    //     {
    //       name: 'Badges',
    //       url: '/notifications/badges',
    //       icon: 'icon-bell',
    //     },
    //     {
    //       name: 'Modals',
    //       url: '/notifications/modals',
    //       icon: 'icon-bell',
    //     },
    //   ],
    // },
    // {
    //   name: 'Widgets',
    //   url: '/widgets',
    //   icon: 'icon-calculator'
    // },
    // {
    //   divider: true,
    // },
    // {
    //   title: true,
    //   name: 'Extras',
    // },
    // {
    //   name: 'Pages',
    //   url: '/pages',
    //   icon: 'icon-star',
    //   children: [
    //     {
    //       name: 'Login',
    //       url: '/login',
    //       icon: 'icon-star',
    //     },
    //     {
    //       name: 'Register',
    //       url: '/register',
    //       icon: 'icon-star',
    //     },
    //     {
    //       name: 'Error 404',
    //       url: '/404',
    //       icon: 'icon-star',
    //     },
    //     {
    //       name: 'Error 500',
    //       url: '/500',
    //       icon: 'icon-star',
    //     },
    //   ],
    // }
  ],
};
