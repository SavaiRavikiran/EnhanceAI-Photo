import React, { useState } from 'react';
import { api } from '@/api/apiClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Users,
    Image,
    Activity,
    Shield,
    Search,
    Ban,
    CheckCircle2,
    Zap,
    TrendingUp,
    Loader2,
} from 'lucide-react';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function Admin() {
    const [search, setSearch] = useState('');
    const [creditDialog, setCreditDialog] = useState(null);
    const [creditAmount, setCreditAmount] = useState('');
    const queryClient = useQueryClient();

    const { data: currentUser } = useQuery({
        queryKey: ['currentUser'],
        queryFn: () => api.auth.me(),
    });

    const { data: users = [], isLoading: usersLoading } = useQuery({
        queryKey: ['allUsers'],
        queryFn: () => api.entities.User.list('-created_date', 100),
        enabled: currentUser?.role === 'admin',
    });

    const { data: jobs = [] } = useQuery({
        queryKey: ['allAdminJobs'],
        queryFn: () => api.entities.EnhancementJob.list('-created_date', 200),
        enabled: currentUser?.role === 'admin',
    });

    const updateUserMutation = useMutation({
        mutationFn: ({ id, data }) => api.entities.User.update(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['allUsers'] }),
    });

    if (currentUser?.role !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <Shield className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <h2 className="text-xl font-bold mb-2">Access Denied</h2>
                <p className="text-muted-foreground">Admin privileges required.</p>
            </div>
        );
    }

    const filteredUsers = users.filter((u) =>
        !search || u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
    );

    const totalCreditsUsed = jobs.reduce((sum, j) => sum + (j.credits_used || 0), 0);
    const completedJobs = jobs.filter((j) => j.status === 'completed').length;

    // Type distribution for pie chart
    const typeDistribution = {};
    jobs.forEach((j) => {
        const t = j.enhancement_type || 'unknown';
        typeDistribution[t] = (typeDistribution[t] || 0) + 1;
    });
    const pieData = Object.entries(typeDistribution).map(([name, value]) => ({
        name: name.replace(/_/g, ' '),
        value,
    }));

    const handleAdjustCredits = () => {
        if (!creditDialog || !creditAmount) return;
        const amount = parseInt(creditAmount);
        updateUserMutation.mutate({
            id: creditDialog.id,
            data: { credits: Math.max(0, (creditDialog.credits || 0) + amount) },
        });
        setCreditDialog(null);
        setCreditAmount('');
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold mb-1">Admin Panel</h1>
                <p className="text-muted-foreground text-sm">Manage users, view analytics, and monitor system health</p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Users', value: users.length, icon: Users, color: 'text-primary' },
                    { label: 'Total Jobs', value: jobs.length, icon: Image, color: 'text-chart-2' },
                    { label: 'Completed', value: completedJobs, icon: CheckCircle2, color: 'text-chart-3' },
                    { label: 'Credits Used', value: totalCreditsUsed, icon: Zap, color: 'text-chart-4' },
                ].map((s) => (
                    <Card key={s.label} className="p-5 bg-card/50 border-border/50">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{s.label}</span>
                            <s.icon className={`h-4 w-4 ${s.color}`} />
                        </div>
                        <p className="text-2xl font-bold">{s.value}</p>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="users" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="jobs">Processing Logs</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-xl max-w-sm" />
                    </div>
                    <Card className="overflow-hidden bg-card/50 border-border/50">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Credits</TableHead>
                                    <TableHead>Enhancements</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {usersLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((u) => (
                                        <TableRow key={u.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium text-sm">{u.full_name || 'Unknown'}</p>
                                                    <p className="text-xs text-muted-foreground">{u.email}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="capitalize text-xs">{u.plan || 'free'}</Badge>
                                            </TableCell>
                                            <TableCell className="font-medium">{u.credits ?? 0}</TableCell>
                                            <TableCell>{u.total_enhancements ?? 0}</TableCell>
                                            <TableCell>
                                                <Badge className={u.is_blocked ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}>
                                                    {u.is_blocked ? 'Blocked' : 'Active'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 text-xs rounded-lg"
                                                        onClick={() => setCreditDialog(u)}
                                                    >
                                                        <Zap className="h-3 w-3 mr-1" />
                                                        Credits
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant={u.is_blocked ? 'outline' : 'destructive'}
                                                        className="h-7 text-xs rounded-lg"
                                                        onClick={() => updateUserMutation.mutate({ id: u.id, data: { is_blocked: !u.is_blocked } })}
                                                    >
                                                        <Ban className="h-3 w-3 mr-1" />
                                                        {u.is_blocked ? 'Unblock' : 'Block'}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                <TabsContent value="jobs" className="space-y-4">
                    <Card className="overflow-hidden bg-card/50 border-border/50">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>File</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Credits</TableHead>
                                    <TableHead>Created By</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {jobs.slice(0, 50).map((j) => (
                                    <TableRow key={j.id}>
                                        <TableCell className="text-sm font-medium truncate max-w-[150px]">{j.file_name || '-'}</TableCell>
                                        <TableCell className="text-xs capitalize">{j.enhancement_type?.replace(/_/g, ' ')}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="text-xs capitalize">{j.status}</Badge>
                                        </TableCell>
                                        <TableCell>{j.credits_used || 1}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">{j.created_by}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {j.created_date ? format(new Date(j.created_date), 'MMM d, h:mm a') : ''}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="p-6 bg-card/50 border-border/50">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Enhancement Types Distribution</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                            {pieData.map((_, idx) => (
                                                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <Card className="p-6 bg-card/50 border-border/50">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Plan Distribution</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={[
                                        { plan: 'Free', count: users.filter(u => (u.plan || 'free') === 'free').length },
                                        { plan: 'Pro', count: users.filter(u => u.plan === 'pro').length },
                                        { plan: 'Enterprise', count: users.filter(u => u.plan === 'enterprise').length },
                                    ]}>
                                        <XAxis dataKey="plan" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                                        <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Credit Adjustment Dialog */}
            <Dialog open={!!creditDialog} onOpenChange={() => setCreditDialog(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adjust Credits for {creditDialog?.full_name || creditDialog?.email}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground mb-4">Current credits: <strong>{creditDialog?.credits ?? 0}</strong></p>
                        <Input
                            type="number"
                            placeholder="Enter amount (positive to add, negative to remove)"
                            value={creditAmount}
                            onChange={(e) => setCreditAmount(e.target.value)}
                            className="rounded-xl"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreditDialog(null)}>Cancel</Button>
                        <Button onClick={handleAdjustCredits} className="gradient-primary text-primary-foreground">Apply</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}