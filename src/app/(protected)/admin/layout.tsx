import React from 'react'

interface Props {
    children: React.ReactNode
}

const AdminLayout = async ({children}: Props) => {
    return (
        <div>
            {children}
        </div>
    )
}
export default AdminLayout