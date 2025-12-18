import { useState, useMemo } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Search,
    Download,
    RefreshCw,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Trash2,
    Plus,
    Filter,
    Pencil,
    RotateCcw
} from "lucide-react"

import { useDebounce } from "@/hooks/use-debounce"
import { DataRecord } from "../types"
import { AddRecordDialog } from "../components/AddRecordDialog"
import { EditRecordDialog } from "../components/EditRecordDialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

// Types
type SortField = "id" | "gender" | "race_ethnicity" | "parental_education" | "math_score" | "reading_score" | "writing_score" | "status" | "lastUpdate"
type SortDirection = "asc" | "desc" | null

interface StudentListPageProps {
    data: DataRecord[]
    onAdd: (record: DataRecord) => void
    onUpdate: (record: DataRecord) => void
    onDelete: (id: number) => void
    onRefresh: () => void
    onReset: () => void
    isRefreshing: boolean
}

export function StudentListPage({
    data,
    onAdd,
    onUpdate,
    onDelete,
    onRefresh,
    onReset,
    isRefreshing
}: StudentListPageProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const debouncedSearchTerm = useDebounce(searchTerm, 300)
    const [sortField, setSortField] = useState<SortField | null>(null)
    const [sortDirection, setSortDirection] = useState<SortDirection>(null)
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingRecord, setEditingRecord] = useState<DataRecord | null>(null)

    const existingIds = useMemo(() => data.map(d => d.id), [data])

    // Lọc và sắp xếp dữ liệu
    const filteredAndSortedData = useMemo(() => {
        const lowerTerm = debouncedSearchTerm.toLowerCase()
        let result = data.filter(
            (item) =>
                (item.id.toString().includes(lowerTerm) ||
                    item.gender.toLowerCase().includes(lowerTerm) ||
                    item.race_ethnicity.toLowerCase().includes(lowerTerm) ||
                    item.parental_education.toLowerCase().includes(lowerTerm) ||
                    item.math.toLowerCase().includes(lowerTerm) ||
                    item.math_score.toString().includes(lowerTerm) ||
                    item.reading.toLowerCase().includes(lowerTerm) ||
                    item.reading_score.toString().includes(lowerTerm) ||
                    item.writing.toLowerCase().includes(lowerTerm) ||
                    item.writing_score.toString().includes(lowerTerm) ||
                    item.status.toLowerCase().includes(lowerTerm) ||
                    item.lastUpdate.toLowerCase().includes(lowerTerm)) &&
                (statusFilter === "all" || item.status === statusFilter)
        )

        if (sortField && sortDirection) {
            result = [...result].sort((a, b) => {
                let aValue: string | number = a[sortField]
                let bValue: string | number = b[sortField]

                if (typeof aValue === "string" && typeof bValue === "string") {
                    aValue = aValue.toLowerCase()
                    bValue = bValue.toLowerCase()
                }

                if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
                if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
                return 0
            })
        }

        return result
    }, [data, debouncedSearchTerm, statusFilter, sortField, sortDirection])

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            if (sortDirection === "asc") {
                setSortDirection("desc")
            } else if (sortDirection === "desc") {
                setSortDirection(null)
                setSortField(null)
            } else {
                setSortDirection("asc")
            }
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
    }

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) {
            return <ArrowUpDown className="ml-2 h-4 w-4" />
        }
        if (sortDirection === "asc") {
            return <ArrowUp className="ml-2 h-4 w-4" />
        }
        if (sortDirection === "desc") {
            return <ArrowDown className="ml-2 h-4 w-4" />
        }
        return <ArrowUpDown className="ml-2 h-4 w-4" />
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return (
                    <Badge className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20">
                        Active
                    </Badge>
                )
            case "inactive":
                return <Badge className="bg-zinc-500/10 text-zinc-400 hover:bg-zinc-500/20 border-zinc-500/20">Inactive</Badge>
            case "pending":
                return (
                    <Badge className="bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border-amber-500/20">Pending</Badge>
                )
            default:
                return <Badge>{status}</Badge>
        }
    }

    const handleOpenEdit = (record: DataRecord) => {
        setEditingRecord(record)
        setIsEditDialogOpen(true)
    }

    const handleSaveEdit = (updatedRecord: DataRecord) => {
        onUpdate(updatedRecord)
        setEditingRecord(null)
    }

    // Xuất dữ liệu ra file CSV
    const handleExport = () => {
        const headers = ["ID", "Gender", "Race/Ethnicity", "Parental Education", "Math Label", "Math Score", "Reading Label", "Reading Score", "Writing Label", "Writing Score", "Status", "Last Update"]
        const csvContent = [
            headers.join(","),
            ...filteredAndSortedData.map(item =>
                [
                    item.id,
                    item.gender,
                    `"${item.race_ethnicity}"`,
                    `"${item.parental_education}"`,
                    item.math,
                    item.math_score,
                    item.reading,
                    item.reading_score,
                    item.writing,
                    item.writing_score,
                    item.status,
                    item.lastUpdate
                ].join(",")
            )
        ].join("\n")

        const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `student_performance_export_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        link.style.visibility = "hidden"

        toast.success("Xuất dữ liệu thành công!", {
            description: `Đã xuất ${filteredAndSortedData.length} records ra file CSV.`
        })
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
                <p className="text-muted-foreground">
                    Quản lý danh sách, chỉnh sửa và theo dõi điểm số chi tiết.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <CardTitle>Performance Table</CardTitle>
                            <CardDescription>Chi tiết điểm số học sinh</CardDescription>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="default" size="sm" onClick={() => setIsAddDialogOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Thêm mới
                            </Button>

                            <AddRecordDialog
                                isOpen={isAddDialogOpen}
                                onOpenChange={setIsAddDialogOpen}
                                onAdd={onAdd}
                                existingIds={existingIds}
                            />

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onRefresh}
                                disabled={isRefreshing}
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                                {isRefreshing ? 'Đang tải...' : 'Refresh'}
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleExport}>
                                <Download className="h-4 w-4 mr-2" />
                                Export CSV
                            </Button>
                            <Button variant="outline" size="sm" onClick={onReset} className="text-orange-500 hover:text-orange-600 hover:bg-orange-500/10">
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Reset CSV
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search & Filter */}
                    <div className="mb-4 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm theo giới tính, sắc tộc, học vấn..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Lọc trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="relative overflow-x-auto rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16 cursor-pointer hover:bg-muted/50" onClick={() => handleSort("id")}>
                                        <div className="flex items-center">ID {getSortIcon("id")}</div>
                                    </TableHead>
                                    <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("gender")}>
                                        <div className="flex items-center">Gender {getSortIcon("gender")}</div>
                                    </TableHead>
                                    <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("race_ethnicity")}>
                                        <div className="flex items-center">Race/Ethnicity {getSortIcon("race_ethnicity")}</div>
                                    </TableHead>
                                    <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("parental_education")}>
                                        <div className="flex items-center">Parental Edu {getSortIcon("parental_education")}</div>
                                    </TableHead>
                                    <TableHead className="text-right cursor-pointer hover:bg-muted/50" onClick={() => handleSort("math_score")}>
                                        <div className="flex items-center justify-end">Math {getSortIcon("math_score")}</div>
                                    </TableHead>
                                    <TableHead className="text-right cursor-pointer hover:bg-muted/50" onClick={() => handleSort("reading_score")}>
                                        <div className="flex items-center justify-end">Reading {getSortIcon("reading_score")}</div>
                                    </TableHead>
                                    <TableHead className="text-right cursor-pointer hover:bg-muted/50" onClick={() => handleSort("writing_score")}>
                                        <div className="flex items-center justify-end">Writing {getSortIcon("writing_score")}</div>
                                    </TableHead>
                                    <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("status")}>
                                        <div className="flex items-center">Status {getSortIcon("status")}</div>
                                    </TableHead>
                                    <TableHead className="w-24">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAndSortedData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="h-24 text-center">
                                            Không tìm thấy kết quả.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredAndSortedData.map((item) => (
                                        <TableRow key={item.id} className="group">
                                            <TableCell className="font-mono text-muted-foreground">{item.id}</TableCell>
                                            <TableCell>{item.gender}</TableCell>
                                            <TableCell>{item.race_ethnicity}</TableCell>
                                            <TableCell>{item.parental_education}</TableCell>
                                            <TableCell className="text-right font-medium">{item.math_score}</TableCell>
                                            <TableCell className="text-right font-medium">{item.reading_score}</TableCell>
                                            <TableCell className="text-right font-medium">{item.writing_score}</TableCell>
                                            <TableCell>{getStatusBadge(item.status)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
                                                        onClick={() => handleOpenEdit(item)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Bạn có chắc muốn xóa record #{item.id}?
                                                                    Hành động này không thể hoàn tác.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => onDelete(item.id)}
                                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                >
                                                                    Xóa
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Info */}
                    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                        <div>
                            Hiển thị {filteredAndSortedData.length} / {data.length} records
                            {searchTerm && ` (tìm: "${searchTerm}")`}
                            {statusFilter !== "all" && ` (lọc: ${statusFilter})`}
                        </div>
                        <div className="flex items-center gap-2">
                            {sortField && (
                                <Badge variant="secondary">
                                    Sắp xếp: {sortField} ({sortDirection})
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <EditRecordDialog
                isOpen={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                record={editingRecord}
                onSave={handleSaveEdit}
                existingIds={existingIds}
            />
        </div>
    )
}
