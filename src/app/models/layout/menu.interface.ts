interface MenuItem {
  /** menu item code */
  code: string;
  /** menu labels */
  label: {
    zh_CN: string;
    en_US: string;
  };
  /** 图标名称
   *
   * 子子菜单不需要图标
   */
  icon?: string;
  /** 菜单路由 */
  path: string;
  /** 子菜单 */
  children?: MenuItem[];
}

export type MenuChild = Omit<MenuItem, 'children'>;

export type MenuList = MenuItem[];

export const salesMenuList: MenuList = [
  {
    code: 'bwicAdmin',
    label: {
      zh_CN: 'BWIC Admin',
      en_US: 'BWIC Admin',
    },
    icon: 'bwicAdmin',
    path: '/salesPortal/bwicAdmin',
  },
  {
    code: 'bwic popular',
    label: {
      zh_CN: 'BWIC Popular',
      en_US: 'BWIC Popular',
    },
    icon: 'bwicPopular',
    path: '/salesPortal/bwicPopularList',
  }
];

export const clientMenuList: MenuList = [
  {
    code: 'bwicList',
    label: {
      zh_CN: 'BWIC Overview',
      en_US: 'BWIC Overview',
    },
    icon: 'bwicList',
    path: '/clientPortal/bwicList',
  },
  {
    code: 'mybidding',
    label: {
      zh_CN: 'Bidding History',
      en_US: 'Bidding History',
    },
    icon: 'mybidding',
    path: '/clientPortal/mybidding',
  }
];
