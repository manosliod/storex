// ** Next Import
import { GetServerSideProps } from 'next/types'

// ** Types
import { UserLayoutType, UsersType } from 'src/types/apps/userTypes'

// ** Demo Components Imports
import UserViewPage from 'src/views/apps/user/view/UserViewPage'

type Props = UserLayoutType & {
  userData: UsersType
  userError: boolean
}

const UserView = ({ id, userData, userError }: any) => {
  return <UserViewPage id={id} userData={userData} userError={userError} />
}

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
  const { id } = query
  const { cookies } = req
  const token = cookies.StorexJWT
  const response = await fetch(`http://localhost:3001/api/v1/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  console.log(response.status)
  if (response.status === 500) {
    return {
      props: {
        id,
        userData: null,
        userError: true
      }
    }
  }
  const data = await response.json()

  const userData = data.doc
  const userError = data.status === 'fail'

  return {
    props: {
      id,
      userData,
      userError
    }
  }
}

export default UserView
