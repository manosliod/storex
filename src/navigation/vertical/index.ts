// ** Icon imports
import AccountOutline from 'mdi-material-ui/AccountOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import StoreOutline from 'mdi-material-ui/StoreOutline'
import ShapeOutline from 'mdi-material-ui/ShapeOutline'
import PackageVariantClosed from 'mdi-material-ui/PackageVariantClosed'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Home',
      icon: HomeOutline,
      path: '/home',
      subject: 'home',
      action: 'manage'
    },
    {
      title: 'Users',
      icon: AccountOutline,
      path: '/users',
      subject: 'users',
      action: 'read'
    },
    {
      title: 'Stores',
      icon: StoreOutline,
      path: '/stores',
      subject: 'stores',
      action: 'read'
    },
    {
      title: 'Categories',
      icon: ShapeOutline,
      path: '/categories',
      subject: 'categories'
    },
    {
      title: 'Products',
      icon: PackageVariantClosed,
      path: '/products',
      subject: 'products'
    }
  ]
}

export default navigation
