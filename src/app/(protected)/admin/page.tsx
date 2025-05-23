'use client'
import { useCurrentUser } from '@/hook/use-current-user'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

const AdminPage = () => {
    const user = useCurrentUser()
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-emerald-200">
            <CardHeader className="space-y-1">
            <div className="flex justify-center">
                <Avatar className="h-16 w-16 border-2 border-emerald-500">
                {user?.image && <AvatarImage src={user.image} />}
                <AvatarFallback className="bg-emerald-100 text-emerald-800">
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || 'A'}
                </AvatarFallback>
                </Avatar>
            </div>
            <CardTitle className="text-center text-2xl text-emerald-800">
                Trang Quản Trị
            </CardTitle>
            <CardDescription className="text-center">
                Đây là khu vực dành riêng cho quản trị viên
            </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4">
            {user && (
                <div className=" bg-emerald-50 p-4 text-center">
                <p className="font-medium text-emerald-800">Xin chào, {user.name || user.email}</p>
                <p className="text-sm text-emerald-600 mt-1">Bạn có quyền quản trị hệ thống</p>
                </div>
            )}
            </CardContent>

            <CardFooter className="flex justify-center">
            <Button asChild variant="default" className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/">Về trang chủ</Link>
            </Button>
            </CardFooter>
        </Card>
        </div>
    )
}

export default AdminPage