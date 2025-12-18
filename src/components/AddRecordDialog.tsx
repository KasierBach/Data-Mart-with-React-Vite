import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { DataRecord } from "../types"

interface AddRecordDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onAdd: (record: DataRecord) => void
    existingIds: number[]
}

export function AddRecordDialog({ isOpen, onOpenChange, onAdd, existingIds }: AddRecordDialogProps) {
    const initialNewRecordState = {
        id: "",
        gender: "male",
        race_ethnicity: "A",
        parental_education: "some college",
        math_score: "",
        reading_score: "",
        writing_score: "",
        status: "active" as "active" | "inactive" | "pending"
    }
    const [newRecord, setNewRecord] = useState(initialNewRecordState)

    const handleAddRecord = () => {
        if (!newRecord.gender || !newRecord.race_ethnicity || !newRecord.parental_education || !newRecord.math_score || !newRecord.reading_score || !newRecord.writing_score) {
            toast.error("Vui lòng điền đầy đủ thông tin!")
            return
        }

        const defaultId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1
        const parsedId = newRecord.id ? parseInt(newRecord.id) : NaN
        const newId = !isNaN(parsedId) && parsedId > 0 ? parsedId : defaultId

        if (existingIds.includes(newId)) {
            toast.error("ID đã tồn tại!", {
                description: `Record với ID #${newId} đã có trong danh sách.`
            })
            return
        }

        const record: DataRecord = {
            id: newId,
            gender: newRecord.gender,
            race_ethnicity: newRecord.race_ethnicity,
            parental_education: newRecord.parental_education,
            math: "Math",
            math_score: parseInt(newRecord.math_score) || 0,
            reading: "Reading",
            reading_score: parseInt(newRecord.reading_score) || 0,
            writing: "Writing",
            writing_score: parseInt(newRecord.writing_score) || 0,
            status: newRecord.status,
            lastUpdate: new Date().toISOString().split('T')[0]
        }

        onAdd(record)
        setNewRecord(initialNewRecordState)
        onOpenChange(false)
        toast.success("Đã thêm record mới!", {
            description: `Student ID: ${record.id} đã được thêm vào danh sách.`
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Thêm Học Sinh Mới</DialogTitle>
                    <DialogDescription>
                        Nhập thông tin học sinh và điểm số.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="id">ID (Tự động nếu để trống)</Label>
                        <Input
                            id="id"
                            type="number"
                            value={newRecord.id}
                            onChange={(e) => setNewRecord(prev => ({ ...prev, id: e.target.value }))}
                            placeholder="Auto-generate"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={newRecord.gender} onValueChange={(v) => setNewRecord(prev => ({ ...prev, gender: v }))}>
                            <SelectTrigger id="gender"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="race">Race/Ethnicity</Label>
                        <Input
                            id="race"
                            value={newRecord.race_ethnicity}
                            onChange={(e) => setNewRecord(prev => ({ ...prev, race_ethnicity: e.target.value }))}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="education">Parental Education</Label>
                        <Input
                            id="education"
                            value={newRecord.parental_education}
                            onChange={(e) => setNewRecord(prev => ({ ...prev, parental_education: e.target.value }))}
                        />
                    </div>
                    <div className="col-span-2 grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="math">Math Score</Label>
                            <Input
                                id="math"
                                type="number"
                                value={newRecord.math_score}
                                onChange={(e) => setNewRecord(prev => ({ ...prev, math_score: e.target.value }))}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="reading">Reading Score</Label>
                            <Input
                                id="reading"
                                type="number"
                                value={newRecord.reading_score}
                                onChange={(e) => setNewRecord(prev => ({ ...prev, reading_score: e.target.value }))}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="writing">Writing Score</Label>
                            <Input
                                id="writing"
                                type="number"
                                value={newRecord.writing_score}
                                onChange={(e) => setNewRecord(prev => ({ ...prev, writing_score: e.target.value }))}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2 col-span-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={newRecord.status}
                            onValueChange={(value: "active" | "inactive" | "pending") =>
                                setNewRecord(prev => ({ ...prev, status: value }))
                            }
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
                    <Button onClick={handleAddRecord}>Thêm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
