// ** Next Import
import { GetServerSideProps } from 'next/types'

// ** Types
import { UserLayoutType, UsersType } from 'src/types/apps/userTypes'

// ** Demo Components Imports
import StoreUserViewPage from 'src/views/apps/stores/user/StoreUserViewPage'
import { useAuth } from 'src/hooks/useAuth'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'

type Props = UserLayoutType & {
  users: any
  storeId: any
}

const UserView = ({ id, users, storeId }: Props) => {
  const auth = useAuth()
  const dispatch = useDispatch<AppDispatch>()

  const authUser = users.find((user: UsersType) => user.username!.toString() === id)
  const userId = authUser === undefined || authUser === null ? id : !!Object.keys(authUser).length ? authUser._id : id

  return <StoreUserViewPage id={userId} storeId={storeId} />
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { all, store_id } = query

  const bufferedBasicAuth = Buffer.from(`${process.env.API_AUTH_USERNAME}:${process.env.API_AUTH_PASSWORD}`).toString(
      'base64'
  )
  const allUsers = await fetch('http://localhost:3001/api/v1/console/users', {
    headers: {
      Authorization: `Basic ${bufferedBasicAuth}`
    }
  })
  const res = await allUsers.json()

  return {
    props: {
      id: all,
      users: res.data,
      storeId: store_id
    }
  }
}

UserView.acl = {
  action: 'manage',
  subject: 'user-view'
}

export default UserView
