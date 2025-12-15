import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
    TrendingUp,
    Users,
    DollarSign,
    Activity,
    Pencil,
    RotateCcw
} from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

// Types
interface DataRecord {
    id: number
    name: string
    department: string
    revenue: number
    status: "active" | "inactive" | "pending"
    lastUpdate: string
}

type SortField = "id" | "name" | "department" | "revenue" | "status" | "lastUpdate"
type SortDirection = "asc" | "desc" | null

// Mock data để sẵn khi chưa có dữ liệu
const initialMockData: DataRecord[] = [
    { id: 1, name: "Nguyễn Văn A", department: "Sales", revenue: 150000000, status: "active", lastUpdate: "2024-01-15" },
    { id: 2, name: "Trần Thị B", department: "Marketing", revenue: 89000000, status: "active", lastUpdate: "2024-01-14" },
    { id: 3, name: "Lê Văn C", department: "IT", revenue: 120000000, status: "inactive", lastUpdate: "2024-01-13" },
    { id: 4, name: "Phạm Thị D", department: "Sales", revenue: 200000000, status: "active", lastUpdate: "2024-01-15" },
    { id: 5, name: "Hoàng Văn E", department: "HR", revenue: 45000000, status: "pending", lastUpdate: "2024-01-12" },
    { id: 6, name: "Vũ Thị F", department: "Finance", revenue: 175000000, status: "active", lastUpdate: "2024-01-15" },
    { id: 7, name: "Đặng Văn G", department: "Operations", revenue: 95000000, status: "active", lastUpdate: "2024-01-14" },
    { id: 8, name: "Bùi Thị H", department: "Sales", revenue: 180000000, status: "active", lastUpdate: "2024-01-15" },
]

const STORAGE_KEY = "datamart_records"

export default function App() {
    const [searchTerm, setSearchTerm] = useState("")
    const [data, setData] = useState<DataRecord[]>(initialMockData)
    const [isLoaded, setIsLoaded] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [sortField, setSortField] = useState<SortField | null>(null)
    const [sortDirection, setSortDirection] = useState<SortDirection>(null)
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingRecord, setEditingRecord] = useState<DataRecord | null>(null)
    const [newRecord, setNewRecord] = useState({
        id: "",
        name: "",
        department: "",
        revenue: "",
        status: "active" as "active" | "inactive" | "pending"
    })

    // Load dữ liệu từ localStorage khi render lần đầu
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            try {
                setData(JSON.parse(saved))
            } catch {
                // Keep initialMockData if parse fails
            }
        }
        setIsLoaded(true)
    }, [])

    // Lưu dữ liệu vào localStorage khi thay đổi
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        }
    }, [data, isLoaded])

    // Tạo hiệu ứng refresh
    const handleRefresh = async () => {
        setIsRefreshing(true)

        // Tạo hiệu ứng loading
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Tải lại dữ liệu từ localStorage
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            try {
                const parsedData = JSON.parse(saved)
                setData(parsedData)
                toast.success("Dữ liệu đã được làm mới!", {
                    description: `${parsedData.length} records đã được tải lại từ bộ nhớ.`
                })
            } catch {
                setData(initialMockData)
                toast.success("Dữ liệu đã được reset!", {
                    description: `${initialMockData.length} records mặc định đã được tải.`
                })
            }
        }

        setIsRefreshing(false)
    }

    // Reset dữ liệu về mock data ban đầu
    const handleReset = () => {
        setData(initialMockData)
        toast.success("Đã reset dữ liệu!", {
            description: `Đã khôi phục ${initialMockData.length} records mặc định.`
        })
    }

    // Xuất dữ liệu ra file CSV
    const handleExport = () => {
        const headers = ["ID", "Name", "Department", "Revenue", "Status", "Last Update"]
        const csvContent = [
            headers.join(","),
            ...filteredAndSortedData.map(item =>
                [
                    item.id,
                    `"${item.name}"`,
                    item.department,
                    item.revenue,
                    item.status,
                    item.lastUpdate
                ].join(",")
            )
        ].join("\n")

        const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `datamart_export_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast.success("Xuất dữ liệu thành công!", {
            description: `Đã xuất ${filteredAndSortedData.length} records ra file CSV.`
        })
    }

    // Xóa bản ghi
    const handleDelete = (id: number) => {
        setData(prev => prev.filter(item => item.id !== id))
        toast.success("Đã xóa record!", {
            description: `Record #${id} đã được xóa khỏi danh sách.`
        })
    }

    // Thêm bản ghi mới
    const handleAddRecord = () => {
        if (!newRecord.name || !newRecord.department || !newRecord.revenue) {
            toast.error("Vui lòng điền đầy đủ thông tin!")
            return
        }

        const defaultId = data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1
        const parsedId = newRecord.id ? parseInt(newRecord.id) : NaN
        const newId = !isNaN(parsedId) && parsedId > 0 ? parsedId : defaultId

        // Kiểm tra ID đã tồn tại
        if (data.some(d => d.id === newId)) {
            toast.error("ID đã tồn tại!", {
                description: `Record với ID #${newId} đã có trong danh sách.`
            })
            return
        }

        const record: DataRecord = {
            id: newId,
            name: newRecord.name,
            department: newRecord.department,
            revenue: parseFloat(newRecord.revenue),
            status: newRecord.status,
            lastUpdate: new Date().toISOString().split('T')[0]
        }

        setData(prev => [...prev, record])
        setNewRecord({ id: "", name: "", department: "", revenue: "", status: "active" })
        setIsAddDialogOpen(false)
        toast.success("Đã thêm record mới!", {
            description: `${record.name} (ID: ${record.id}) đã được thêm vào danh sách.`
        })
    }

    // Mở form chỉnh sửa
    const handleOpenEdit = (record: DataRecord) => {
        setEditingRecord({ ...record, originalId: record.id } as DataRecord & { originalId: number })
        setIsEditDialogOpen(true)
    }

    // Lưu bản ghi đã chỉnh sửa
    const handleSaveEdit = () => {
        if (!editingRecord) return

        if (!editingRecord.id || !editingRecord.name || !editingRecord.department || !editingRecord.revenue) {
            toast.error("Vui lòng điền đầy đủ thông tin!")
            return
        }

        const originalId = (editingRecord as DataRecord & { originalId?: number }).originalId ?? editingRecord.id

        // Kiểm tra ID đã tồn tại (chỉ khi ID thay đổi)
        if (editingRecord.id !== originalId && data.some(d => d.id === editingRecord.id)) {
            toast.error("ID đã tồn tại!", {
                description: `Record với ID #${editingRecord.id} đã có trong danh sách.`
            })
            return
        }

        setData(prev => prev.map(item =>
            item.id === originalId
                ? { ...editingRecord, lastUpdate: new Date().toISOString().split('T')[0] }
                : item
        ))
        setIsEditDialogOpen(false)
        setEditingRecord(null)
        toast.success("Đã cập nhật record!", {
            description: `${editingRecord.name} (ID: ${editingRecord.id}) đã được cập nhật.`
        })
    }

    // Xử lý sắp xếp
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

    // Lấy icon sắp xếp
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

    // Lọc và sắp xếp dữ liệu
    const filteredAndSortedData = useMemo(() => {
        let result = data.filter(
            (item) =>
                (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.department.toLowerCase().includes(searchTerm.toLowerCase())) &&
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
    }, [data, searchTerm, statusFilter, sortField, sortDirection])

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
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

    // Tính toán thống kê
    const stats = useMemo(() => ({
        total: data.length,
        active: data.filter(d => d.status === "active").length,
        totalRevenue: data.reduce((acc, curr) => acc + curr.revenue, 0),
        avgRevenue: data.length > 0 ? data.reduce((acc, curr) => acc + curr.revenue, 0) / data.length : 0,
    }), [data])

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <Toaster richColors position="top-right" />
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-balance">Datamart Dashboard</h1>
                        <p className="text-muted-foreground">Quản lý và visualize dữ liệu datamart của bạn</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="overflow-hidden">
                        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                            <CardDescription>Total Records</CardDescription>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <CardTitle className="text-3xl">{stats.total}</CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stats.active} đang hoạt động
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="overflow-hidden">
                        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                            <CardDescription>Active</CardDescription>
                            <Activity className="h-4 w-4 text-emerald-400" />
                        </CardHeader>
                        <CardContent>
                            <CardTitle className="text-3xl text-emerald-400">
                                {stats.active}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">
                                {((stats.active / stats.total) * 100).toFixed(0)}% tổng số
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="overflow-hidden">
                        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                            <CardDescription>Total Revenue</CardDescription>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <CardTitle className="text-2xl">
                                {formatCurrency(stats.totalRevenue)}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">
                                Tổng doanh thu
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="overflow-hidden">
                        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                            <CardDescription>Avg Revenue</CardDescription>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <CardTitle className="text-xl">
                                {formatCurrency(stats.avgRevenue)}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">
                                Trung bình / record
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Table Card */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <CardTitle>Data Table</CardTitle>
                                <CardDescription>View và quản lý dữ liệu datamart</CardDescription>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="default" size="sm">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Thêm mới
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Thêm Record Mới</DialogTitle>
                                            <DialogDescription>
                                                Điền thông tin để thêm record mới vào danh sách.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="id">ID</Label>
                                                <Input
                                                    id="id"
                                                    type="number"
                                                    value={newRecord.id}
                                                    onChange={(e) => setNewRecord(prev => ({ ...prev, id: e.target.value }))}
                                                    placeholder={`Để trống sẽ tự động tạo (mặc định: ${data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1})`}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="name">Tên</Label>
                                                <Input
                                                    id="name"
                                                    value={newRecord.name}
                                                    onChange={(e) => setNewRecord(prev => ({ ...prev, name: e.target.value }))}
                                                    placeholder="Nhập tên..."
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="department">Phòng ban</Label>
                                                <Input
                                                    id="department"
                                                    value={newRecord.department}
                                                    onChange={(e) => setNewRecord(prev => ({ ...prev, department: e.target.value }))}
                                                    placeholder="Nhập phòng ban..."
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="revenue">Doanh thu (VND)</Label>
                                                <Input
                                                    id="revenue"
                                                    type="number"
                                                    value={newRecord.revenue}
                                                    onChange={(e) => setNewRecord(prev => ({ ...prev, revenue: e.target.value }))}
                                                    placeholder="Nhập doanh thu..."
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="status">Trạng thái</Label>
                                                <Select
                                                    value={newRecord.status}
                                                    onValueChange={(value: "active" | "inactive" | "pending") =>
                                                        setNewRecord(prev => ({ ...prev, status: value }))
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
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                                Hủy
                                            </Button>
                                            <Button onClick={handleAddRecord}>
                                                Thêm
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRefresh}
                                    disabled={isRefreshing}
                                >
                                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                                    {isRefreshing ? 'Đang tải...' : 'Refresh'}
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleExport}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Export CSV
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleReset} className="text-orange-500 hover:text-orange-600 hover:bg-orange-500/10">
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Reset
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
                                    placeholder="Tìm kiếm theo tên hoặc phòng ban..."
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
                                        <TableHead
                                            className="w-16 cursor-pointer hover:bg-muted/50"
                                            onClick={() => handleSort("id")}
                                        >
                                            <div className="flex items-center">
                                                ID
                                                {getSortIcon("id")}
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() => handleSort("name")}
                                        >
                                            <div className="flex items-center">
                                                Name
                                                {getSortIcon("name")}
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() => handleSort("department")}
                                        >
                                            <div className="flex items-center">
                                                Department
                                                {getSortIcon("department")}
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="text-right cursor-pointer hover:bg-muted/50"
                                            onClick={() => handleSort("revenue")}
                                        >
                                            <div className="flex items-center justify-end">
                                                Revenue
                                                {getSortIcon("revenue")}
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() => handleSort("status")}
                                        >
                                            <div className="flex items-center">
                                                Status
                                                {getSortIcon("status")}
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() => handleSort("lastUpdate")}
                                        >
                                            <div className="flex items-center">
                                                Last Update
                                                {getSortIcon("lastUpdate")}
                                            </div>
                                        </TableHead>
                                        <TableHead className="w-24">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAndSortedData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-24 text-center">
                                                Không tìm thấy kết quả.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredAndSortedData.map((item) => (
                                            <TableRow key={item.id} className="group">
                                                <TableCell className="font-mono text-muted-foreground">{item.id}</TableCell>
                                                <TableCell className="font-medium">{item.name}</TableCell>
                                                <TableCell>{item.department}</TableCell>
                                                <TableCell className="text-right font-mono">{formatCurrency(item.revenue)}</TableCell>
                                                <TableCell>{getStatusBadge(item.status)}</TableCell>
                                                <TableCell className="text-muted-foreground">{item.lastUpdate}</TableCell>
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
                                                                        Bạn có chắc muốn xóa record của <strong>{item.name}</strong>?
                                                                        Hành động này không thể hoàn tác.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => handleDelete(item.id)}
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

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Chỉnh sửa Record</DialogTitle>
                            <DialogDescription>
                                Cập nhật thông tin cho record #{editingRecord?.id}
                            </DialogDescription>
                        </DialogHeader>
                        {editingRecord && (
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-id">ID</Label>
                                    <Input
                                        id="edit-id"
                                        type="number"
                                        value={editingRecord?.id ?? ""}
                                        onChange={(e) => setEditingRecord(prev => prev ? { ...prev, id: parseInt(e.target.value) || 0 } : null)}
                                        placeholder="Nhập ID..."
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-name">Tên</Label>
                                    <Input
                                        id="edit-name"
                                        value={editingRecord.name}
                                        onChange={(e) => setEditingRecord(prev => prev ? { ...prev, name: e.target.value } : null)}
                                        placeholder="Nhập tên..."
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-department">Phòng ban</Label>
                                    <Input
                                        id="edit-department"
                                        value={editingRecord.department}
                                        onChange={(e) => setEditingRecord(prev => prev ? { ...prev, department: e.target.value } : null)}
                                        placeholder="Nhập phòng ban..."
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-revenue">Doanh thu (VND)</Label>
                                    <Input
                                        id="edit-revenue"
                                        type="number"
                                        value={editingRecord.revenue}
                                        onChange={(e) => setEditingRecord(prev => prev ? { ...prev, revenue: parseFloat(e.target.value) || 0 } : null)}
                                        placeholder="Nhập doanh thu..."
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-status">Trạng thái</Label>
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
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Hủy
                            </Button>
                            <Button onClick={handleSaveEdit}>
                                Lưu thay đổi
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Footer */}
                <div className="text-center text-sm text-muted-foreground">
                    <p>Datamart Dashboard V1 • Được xây dựng với React & shadcn/ui</p>
                </div>
            </div>
        </div>
    )
}
