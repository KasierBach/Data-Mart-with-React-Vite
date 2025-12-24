import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { API_ENDPOINTS } from "@/config/api"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface ProfileDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
    const { user, updateUser } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState(user?.name || "")
    const [email, setEmail] = useState(user?.email || "")
    const [phone, setPhone] = useState(user?.phone || "")
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    // Sync form with user data when dialog opens
    useEffect(() => {
        if (open && user) {
            setName(user.name || "")
            setEmail(user.email || "")
            setPhone(user.phone || "")
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")
        }
    }, [open, user])

    if (!user) return null

    const handleSave = async () => {
        setIsLoading(true)

        // Validate basic fields
        if (!name.trim()) {
            toast.error("Họ tên không được để trống")
            setIsLoading(false)
            return
        }

        // Validate password change
        if (newPassword || currentPassword) {
            if (!currentPassword) {
                toast.error("Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu")
                setIsLoading(false)
                return
            }
            if (newPassword !== confirmPassword) {
                toast.error("Mật khẩu mới không khớp")
                setIsLoading(false)
                return
            }
        }

        try {
            const body: any = {
                name,
                email,
                phone,
            }

            if (newPassword) {
                body.currentPassword = currentPassword
                body.newPassword = newPassword
            }

            const response = await fetch(`${API_ENDPOINTS.USERS}/${user.username}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to update profile")
            }

            // Update local context
            updateUser(data.user)

            toast.success(data.message)

            // Clear passwords
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")

            onOpenChange(false)
        } catch (error: any) {
            console.error("Update profile error:", error)
            toast.error(error.message || "Cập nhật thất bại")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Cập nhật thông tin</DialogTitle>
                    <DialogDescription>
                        Chỉnh sửa thông tin cá nhân của bạn tại đây.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Username
                        </Label>
                        <Input
                            id="username"
                            value={user.username}
                            disabled
                            className="col-span-3 bg-muted"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Họ tên
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                            SĐT
                        </Label>
                        <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="col-span-3"
                        />
                    </div>

                    <div className="border-t pt-4 mt-2">
                        <p className="text-sm font-medium mb-3 text-muted-foreground">Đổi mật khẩu (Tuỳ chọn)</p>
                        <div className="grid gap-3">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="current-pass" className="text-right text-xs">
                                    Mật khẩu cũ
                                </Label>
                                <Input
                                    id="current-pass"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="col-span-3 h-8 text-sm"
                                    placeholder="Chỉ nhập nếu muốn đổi pass"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="new-pass" className="text-right text-xs">
                                    Mật khẩu mới
                                </Label>
                                <Input
                                    id="new-pass"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="col-span-3 h-8 text-sm"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="confirm-pass" className="text-right text-xs">
                                    Xác nhận
                                </Label>
                                <Input
                                    id="confirm-pass"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="col-span-3 h-8 text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSave} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Lưu thay đổi
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
