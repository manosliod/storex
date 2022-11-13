// ** Next Import
import { GetServerSideProps } from 'next/types'

// ** Types
import { UserLayoutType } from 'src/types/apps/userTypes'

// ** Demo Components Imports
import StoreViewPage from 'src/views/apps/stores/view/StoreViewPage'
import { useAuth } from 'src/hooks/useAuth'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import NotAuthorized from 'src/pages/401'

const SubStoreView = ({ id }: UserLayoutType) => {
  const auth = useAuth()
  const { user }: any = auth
  if (user.role === 'store-admin' || user.role === 'store-sub-admin')
    if (!user.subStores.find((subStore: any) => subStore === id)) return <NotAuthorized />

  return <StoreViewPage id={id} />
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { id } = query

  return {
    props: {
      id
    }
  }
}

SubStoreView.acl = {
  action: 'manage',
  subject: 'sub-store-view'
}

export default SubStoreView
