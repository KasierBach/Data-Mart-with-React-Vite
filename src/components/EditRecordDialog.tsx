import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { DataRecord } from "../types"

interface EditRecordDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    record: DataRecord | null
    onSave: (record: DataRecord) => void
    existingIds: number[]
}

export function EditRecordDialog({ isOpen, onOpenChange, record, onSave, existingIds }: EditRecordDialogProps) {
    const [editingRecord, setEditingRecord] = useState<DataRecord | null>(null)

    useEffect(() => {
        setEditingRecord(record)
    }, [record, isOpen])

    const handleSaveEdit = () => {
        if (!editingRecord) return

        if (!editingRecord.id || !editingRecord.gender || !editingRecord.race_ethnicity) {
            toast.error("Vui lòng điền đầy đủ thông tin!")
            return
        }

        // Check if ID changed and is unique (excluding the current record's original ID if passible, but here relying on current ID check)
        // NOTE: In App.tsx logic: "If editingRecord.id !== originalId && data.some(d => d.id === editingRecord.id)"
        // Since we don't pass 'originalId' explicitly separately, use the record prop.

        if (record && editingRecord.id !== record.id && existingIds.includes(editingRecord.id)) {
            toast.error("ID đã tồn tại!", {
                description: `Record với ID #${editingRecord.id} đã có trong danh sách.`
            })
            return
        }

        onSave({
            ...editingRecord,
            lastUpdate: new Date().toISOString().split('T')[0]
        })

        onOpenChange(false)
        toast.success("Đã cập nhật record!", {
            description: `Student ID: ${editingRecord.id} đã được cập nhật.`
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa Record</DialogTitle>
                    <DialogDescription>
                        Cập nhật thông tin cho record #{record?.id}
                    </DialogDescription>
                </DialogHeader>
                {editingRecord && (
                    <div className="grid gap-4 py-4 grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-id">ID</Label>
                            <Input
                                id="edit-id"
                                type="number"
                                value={editingRecord.id}
                                onChange={(e) => setEditingRecord(prev => prev ? { ...prev, id: parseInt(e.target.value) || 0 } : null)}
                                placeholder="Nhập ID..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-gender">Gender</Label>
                            <Select value={editingRecord.gender} onValueChange={(v) => setEditingRecord(prev => prev ? { ...prev, gender: v } : null)}>
                                <SelectTrigger id="edit-gender"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-race">Race/Ethnicity</Label>
                            <Input
                                id="edit-race"
                                value={editingRecord.race_ethnicity}
                                onChange={(e) => setEditingRecord(prev => prev ? { ...prev, race_ethnicity: e.target.value } : null)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-education">Parental Education</Label>
                            <Input
                                id="edit-education"
                                value={editingRecord.parental_education}
                                onChange={(e) => setEditingRecord(prev => prev ? { ...prev, parental_education: e.target.value } : null)}
                            />
                        </div>
                        <div className="col-span-2 grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-math">Math Score</Label>
                                <Input
                                    id="edit-math"
                                    type="number"
                                    value={editingRecord.math_score}
                                    onChange={(e) => setEditingRecord(prev => prev ? { ...prev, math_score: parseFloat(e.target.value) || 0 } : null)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-reading">Reading Score</Label>
                                <Input
                                    id="edit-reading"
                                    type="number"
                                    value={editingRecord.reading_score}
                                    onChange={(e) => setEditingRecord(prev => prev ? { ...prev, reading_score: parseFloat(e.target.value) || 0 } : null)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-writing">Writing Score</Label>
                                <Input
                                    id="edit-writing"
                                    type="number"
                                    value={editingRecord.writing_score}
                                    onChange={(e) => setEditingRecord(prev => prev ? { ...prev, writing_score: parseFloat(e.target.value) || 0 } : null)}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2 col-span-2">
                            <Label htmlFor="edit-status">Status</Label>
                            <Select
                                value={editingRecord.status}
                                onValueChange={(value: "active" | "inactive" | "pending") =>
                                    setEditingRecord(prev => prev ? { ...prev, status: value } : null)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button onClick={handleSaveEdit}>
                        Lưu thay đổi
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
