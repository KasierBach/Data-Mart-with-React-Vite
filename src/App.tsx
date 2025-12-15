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
    Users,
    BookOpen, // For Reading
    PenTool, // For Writing
    Calculator, // For Math
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
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { DataRecord } from "./types"
import { AddRecordDialog } from "./components/AddRecordDialog"
import { EditRecordDialog } from "./components/EditRecordDialog"
import { useDebounce } from "@/hooks/use-debounce"

// Types
type SortField = "id" | "gender" | "race_ethnicity" | "parental_education" | "math_score" | "reading_score" | "writing_score" | "status" | "lastUpdate"
type SortDirection = "asc" | "desc" | null

// Mock data based on CSV (fallback only)
const initialMockData: DataRecord[] = [
    { id: 1, gender: "male", race_ethnicity: "A", parental_education: "some college", math_label: "Math", math_score: 50, reading_label: "Reading", reading_score: 47, writing_label: "Writing", writing_score: 54, status: "active", lastUpdate: "2024-01-15" },
]

// CSV parsing function
function parseCSV(csvText: string): DataRecord[] {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '')
    const records: DataRecord[] = []

    // Skip header line (index 0)
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i]
        // Parse CSV with quoted values
        const values: string[] = []
        let current = ''
        let inQuote = false
        for (let j = 0; j < line.length; j++) {
            const char = line[j]
            if (char === '"') {
                inQuote = !inQuote
            } else if (char === ',' && !inQuote) {
                values.push(current)
                current = ''
            } else {
                current += char
            }
        }
        values.push(current)

        if (values.length >= 9) {
            records.push({
                id: i,
                gender: values[0],
                race_ethnicity: values[1],
                parental_education: values[2],
                math_label: values[3],
                math_score: parseInt(values[4]) || 0,
                reading_label: values[5],
                reading_score: parseInt(values[6]) || 0,
                writing_label: values[7],
                writing_score: parseInt(values[8]) || 0,
                status: "active",
                lastUpdate: "2024-01-15"
            })
        }
    }
    return records
}

// Fetch CSV data from public folder
async function fetchCSVData(): Promise<DataRecord[]> {
    try {
        console.log('Attempting to fetch CSV data...')
        const response = await fetch('/data.csv')
        console.log('Response status:', response.status)
        if (!response.ok) {
            throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`)
        }
        const csvText = await response.text()
        console.log('CSV text length:', csvText.length)
        const parsedData = parseCSV(csvText)
        console.log('Parsed data length:', parsedData.length)
        return parsedData
    } catch (error) {
        console.error('Error loading CSV:', error)
        return []
    }
}

const STORAGE_KEY = "student_performance_records"


export default function App() {
    const [searchTerm, setSearchTerm] = useState("")
    const debouncedSearchTerm = useDebounce(searchTerm, 300)
    const [data, setData] = useState<DataRecord[]>(initialMockData)
    const [isLoaded, setIsLoaded] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [sortField, setSortField] = useState<SortField | null>(null)
    const [sortDirection, setSortDirection] = useState<SortDirection>(null)
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingRecord, setEditingRecord] = useState<DataRecord | null>(null)

    // Load dữ liệu từ localStorage khi render lần đầu, nếu không có thì tải từ CSV
    useEffect(() => {
        const loadData = async () => {
            const saved = localStorage.getItem(STORAGE_KEY)
            if (saved) {
                try {
                    const parsed = JSON.parse(saved)
                    // Simple check if it looks like our new data (has math_score)
                    if (parsed.length > 0 && typeof parsed[0].math_score === 'number') {
                        console.log('Loaded data from localStorage:', parsed.length, 'records')
                        setData(parsed)
                        setIsLoaded(true)
                        return
                    }
                } catch {
                    // fall through
                }
            }
            // No valid saved data, load CSV
            console.log('Loading data from CSV...')
            const csvData = await fetchCSVData()
            if (csvData.length > 0) {
                console.log('Successfully loaded CSV data:', csvData.length, 'records')
                setData(csvData)
                toast.success("Đã tải dữ liệu từ CSV!", {
                    description: `${csvData.length} records đã được tải.`
                })
            } else {
                console.log('CSV loading failed, using mock data')
                setData(initialMockData)
                toast.error("Không thể tải dữ liệu CSV!", {
                    description: "Đang sử dụng dữ liệu mẫu."
                })
            }
            setIsLoaded(true)
        }

        loadData()
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
        await new Promise(resolve => setTimeout(resolve, 1000))
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            try {
                const parsedData = JSON.parse(saved)
                // Validate schema again
                if (parsedData.length > 0 && typeof parsedData[0].math_score === 'number') {
                    setData(parsedData)
                    toast.success("Dữ liệu đã được làm mới!", {
                        description: `${parsedData.length} records đã được tải lại từ bộ nhớ.`
                    })
                } else {
                    setData(initialMockData)
                    toast.success("Dữ liệu không tương thích, đã reset về mặc định!", {
                        description: `Loaded default mock data.`
                    })
                }
            } catch {
                setData(initialMockData)
                toast.success("Dữ liệu đã được reset!", {
                    description: `${initialMockData.length} records mặc định đã được tải.`
                })
            }
        }
        setIsRefreshing(false)
    }

    // Reset dữ liệu về dữ liệu CSV gốc
    const handleReset = async () => {
        console.log('Resetting data from CSV...')
        const csvData = await fetchCSVData()
        if (csvData.length > 0) {
            setData(csvData)
            toast.success("Đã reset dữ liệu từ CSV!", {
                description: `Đã khôi phục ${csvData.length} records từ file CSV.`
            })
        } else {
            setData(initialMockData)
            toast.error("Không thể tải dữ liệu CSV!", {
                description: `Đã khôi phục ${initialMockData.length} records mặc định.`
            })
        }
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
                    item.math_label,
                    item.math_score,
                    item.reading_label,
                    item.reading_score,
                    item.writing_label,
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

    // Xóa bản ghi
    const handleDelete = (id: number) => {
        setData(prev => prev.filter(item => item.id !== id))
        toast.success("Đã xóa record!", {
            description: `Record #${id} đã được xóa khỏi danh sách.`
        })
    }

    // Thêm bản ghi mới
    const handleAddRecord = (record: DataRecord) => {
        setData(prev => [...prev, record])
    }

    // Mở form chỉnh sửa
    const handleOpenEdit = (record: DataRecord) => {
        setEditingRecord(record)
        setIsEditDialogOpen(true)
    }

    // Lưu bản ghi đã chỉnh sửa
    const handleSaveEdit = (updatedRecord: DataRecord) => {
        // Use editingRecord original ID to find the item
        if (!editingRecord) return

        setData(prev => prev.map(item =>
            item.id === editingRecord.id // Use the id of the record being edited
                ? updatedRecord
                : item
        ))

        setEditingRecord(null)
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
        const lowerTerm = debouncedSearchTerm.toLowerCase()
        let result = data.filter(
            (item) =>
                (item.id.toString().includes(lowerTerm) ||
                    item.gender.toLowerCase().includes(lowerTerm) ||
                    item.race_ethnicity.toLowerCase().includes(lowerTerm) ||
                    item.parental_education.toLowerCase().includes(lowerTerm) ||
                    item.math_label.toLowerCase().includes(lowerTerm) ||
                    item.math_score.toString().includes(lowerTerm) ||
                    item.reading_label.toLowerCase().includes(lowerTerm) ||
                    item.reading_score.toString().includes(lowerTerm) ||
                    item.writing_label.toLowerCase().includes(lowerTerm) ||
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
    const stats = useMemo(() => {
        const total = data.length
        if (total === 0) return { total: 0, active: 0, avgMath: 0, avgReading: 0, avgWriting: 0 }

        return {
            total,
            active: data.filter(d => d.status === "active").length,
            avgMath: data.reduce((acc, curr) => acc + curr.math_score, 0) / total,
            avgReading: data.reduce((acc, curr) => acc + curr.reading_score, 0) / total,
            avgWriting: data.reduce((acc, curr) => acc + curr.writing_score, 0) / total,
        }
    }, [data])

    const existingIds = useMemo(() => data.map(d => d.id), [data])

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <Toaster richColors position="top-right" />
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-balance">Student Performance Dashboard</h1>
                        <p className="text-muted-foreground">Theo dõi và phân tích kết quả học tập</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="overflow-hidden">
                        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                            <CardDescription>Total Students</CardDescription>
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
                            <CardDescription>Avg Math Score</CardDescription>
                            <Calculator className="h-4 w-4 text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <CardTitle className="text-2xl text-blue-400">
                                {stats.avgMath.toFixed(1)}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">
                                Điểm toán trung bình
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="overflow-hidden">
                        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                            <CardDescription>Avg Reading Score</CardDescription>
                            <BookOpen className="h-4 w-4 text-purple-400" />
                        </CardHeader>
                        <CardContent>
                            <CardTitle className="text-2xl text-purple-400">
                                {stats.avgReading.toFixed(1)}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">
                                Điểm đọc trung bình
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="overflow-hidden">
                        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                            <CardDescription>Avg Writing Score</CardDescription>
                            <PenTool className="h-4 w-4 text-orange-400" />
                        </CardHeader>
                        <CardContent>
                            <CardTitle className="text-2xl text-orange-400">
                                {stats.avgWriting.toFixed(1)}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">
                                Điểm viết trung bình
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Table Card */}
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
                                    onAdd={handleAddRecord}
                                    existingIds={existingIds}
                                />

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
                <EditRecordDialog
                    isOpen={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    record={editingRecord}
                    onSave={handleSaveEdit}
                    existingIds={existingIds}
                />

                {/* Footer */}
                <div className="text-center text-sm text-muted-foreground">
                    <p>Student Performance Dashboard V1 • Được xây dựng với React & shadcn/ui</p>
                </div>
            </div>
        </div>
    )
}
