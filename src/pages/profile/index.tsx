// ** Next Import
import { GetServerSideProps } from 'next/types'

// ** Types
import { UserLayoutType } from 'src/types/apps/userTypes'

// ** Demo Components Imports
import UserViewPage from 'src/views/apps/user/view/UserViewPage'

import { useAuth } from 'src/hooks/useAuth'

const UserView = ({ id }: UserLayoutType) => {
  const auth = useAuth()
  const authUserId = auth?.user !== null ? (auth.user._id === undefined ? '' : auth.user._id) : ''
  const userId = id ? id : authUserId

  return <UserViewPage id={userId} />
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
