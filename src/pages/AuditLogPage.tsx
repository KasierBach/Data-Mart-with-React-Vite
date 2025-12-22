import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { API_ENDPOINTS } from "@/config/api";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
} from "@/components/ui/alert-dialog";
import { Search, History, CheckCircle2, XCircle, Trash2, RefreshCw } from "lucide-react";

interface AuditLog {
    id: number;
    username: string;
    action: string;
    details: string;
    ip_address: string;
    created_at: string;
}

export function AuditLogPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [actionFilter, setActionFilter] = useState<string>("all");
    const [isLoading, setIsLoading] = useState(true);

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_ENDPOINTS.AUDIT_LOGS);
            const data = await response.json();
            setLogs(data);
        } catch (error) {
            console.error("Error fetching logs:", error);
            toast.error("Không thể tải nhật ký!");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`${API_ENDPOINTS.AUDIT_LOGS}/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setLogs(prev => prev.filter(log => log.id !== id));
                toast.success("Đã xóa log!");
            }
        } catch (error) {
            console.error("Error deleting log:", error);
            toast.error("Không thể xóa log!");
        }
    };

    const handleClearAll = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.AUDIT_LOGS, {
                method: 'DELETE'
            });
            if (response.ok) {
                setLogs([]);
                toast.success("Đã xóa tất cả logs!");
            }
        } catch (error) {
            console.error("Error clearing logs:", error);
            toast.error("Không thể xóa logs!");
        }
    };

    const filteredLogs = logs.filter(log => {
        const matchesSearch =
            log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.details.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesAction = actionFilter === "all" || log.action === actionFilter;

        return matchesSearch && matchesAction;
    });

    const getActionBadge = (action: string) => {
        switch (action) {
            case 'LOGIN_SUCCESS':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200"><CheckCircle2 className="h-3 w-3 mr-1" /> Success</Badge>;
            case 'LOGIN_FAILED':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200"><XCircle className="h-3 w-3 mr-1" /> Failed</Badge>;
            default:
                return <Badge variant="secondary">{action}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Nhật ký hệ thống</h1>
                <p className="text-muted-foreground flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Theo dõi các hoạt động đăng nhập và thao tác của người dùng.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Lịch sử hoạt động</CardTitle>
                            <CardDescription>Danh sách 100 thao tác gần nhất ({filteredLogs.length} hiển thị)</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={fetchLogs}>
                                <RefreshCw className="h-4 w-4 mr-1" /> Refresh
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm" disabled={logs.length === 0}>
                                        <Trash2 className="h-4 w-4 mr-1" /> Xóa tất cả
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Xác nhận xóa tất cả?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Bạn có chắc muốn xóa tất cả {logs.length} bản ghi nhật ký? Hành động này không thể hoàn tác.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleClearAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                            Xóa tất cả
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <div className="relative flex-1 min-w-[200px] max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm theo user, chi tiết..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={actionFilter} onValueChange={setActionFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Lọc theo hành động" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả</SelectItem>
                                <SelectItem value="LOGIN_SUCCESS">Đăng nhập thành công</SelectItem>
                                <SelectItem value="LOGIN_FAILED">Đăng nhập thất bại</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Thời gian</TableHead>
                                    <TableHead>Người dùng</TableHead>
                                    <TableHead>Hành động</TableHead>
                                    <TableHead>Chi tiết</TableHead>
                                    <TableHead>IP Address</TableHead>
                                    <TableHead className="w-[60px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            Đang tải dữ liệu...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredLogs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            {searchTerm || actionFilter !== "all" ? "Không tìm thấy kết quả phù hợp." : "Chưa có nhật ký hoạt động."}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredLogs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="font-mono text-xs">
                                                {format(new Date(log.created_at), "dd/MM/yyyy HH:mm:ss")}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                                        {log.username[0].toUpperCase()}
                                                    </div>
                                                    <span className="font-medium">{log.username}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getActionBadge(log.action)}
                                            </TableCell>
                                            <TableCell className="max-w-md truncate text-sm">
                                                {log.details}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground font-mono">
                                                {log.ip_address}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                    onClick={() => handleDelete(log.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
