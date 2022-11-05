// ** Next Import
import { GetServerSideProps } from 'next/types'

// ** Types
import { StoreLayoutType } from 'src/types/apps/storeTypes'

// ** Demo Components Imports
import StoreViewPage from 'src/views/apps/stores/view/StoreViewPage'

import { useAuth } from 'src/hooks/useAuth'

const UserView = ({ id }: StoreLayoutType) => {
  const auth = useAuth()
  const authUserId = auth?.user !== null ? (auth.user._id === undefined ? '' : auth.user._id) : ''
  const userId = id ? id : authUserId

  return <StoreViewPage id={userId} />
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { id } = query

  return {
    props: {
      id: id ? id : ''
    }
  }
}

export default UserView
