// ** Next Import
import { GetServerSideProps } from 'next/types'

// ** Types
import { UserLayoutType } from 'src/types/apps/userTypes'

// ** Demo Components Imports
import CategoryViewPage from 'src/views/apps/categories/view/CategoryViewPage'

const CategoryView = ({ id }: UserLayoutType) => {
  console.log(id, 'id')
  return <CategoryViewPage id={id} />
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { id } = query

  return {
    props: {
      id
    }
  }
}

CategoryView.acl = {
  action: 'manage',
  subject: 'category-view'
}

export default CategoryView
