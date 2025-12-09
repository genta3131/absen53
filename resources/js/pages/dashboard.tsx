import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
// IMPORT LIBRARY GRAFIK
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

export default function Dashboard({ auth, summary, todaysAttendances, monthlyStats, topLateClasses }: { auth: any, summary: any, todaysAttendances: any[], monthlyStats: any[], topLateClasses: any[] }) {
    
    // Warna untuk grafik (Hadir=Hijau, Sakit=Kuning, dll)
    const COLORS: { [key: string]: string } = {
        'Hadir': '#10B981',    // Emerald-500
        'Sakit': '#F59E0B',    // Yellow-500
        'Izin': '#3B82F6',     // Blue-500
        'Alpa': '#EF4444',     // Red-500
        'Terlambat': '#F97316' // Orange-500
    };

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Dashboard',
                    href: '/dashboard',
                },
            ]}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* 1. RINGKASAN HARIAN (Sama seperti sebelumnya) */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                        <div className="bg-card p-6 border-l-4 border-yellow-500 shadow-md border border-border rounded-lg">
                            <div className="text-muted-foreground text-sm font-bold">Sakit Hari Ini</div>
                            <div className="text-3xl font-bold text-foreground">{summary.sakit}</div>
                        </div>
                        <div className="bg-card p-6 border-l-4 border-blue-500 shadow-md border border-border rounded-lg">
                            <div className="text-muted-foreground text-sm font-bold">Izin Hari Ini</div>
                            <div className="text-3xl font-bold text-foreground">{summary.izin}</div>
                        </div>
                        <div className="bg-card p-6 border-l-4 border-red-500 shadow-md border border-border rounded-lg">
                            <div className="text-muted-foreground text-sm font-bold">Alpa Hari Ini</div>
                            <div className="text-3xl font-bold text-foreground">{summary.alpa}</div>
                        </div>
                        <div className="bg-card p-6 border-l-4 border-orange-500 shadow-md border border-border rounded-lg">
                            <div className="text-muted-foreground text-sm font-bold">Terlambat Hari Ini</div>
                            <div className="text-3xl font-bold text-foreground">{summary.terlambat}</div>
                        </div>
                        <div className="bg-card p-6 border-l-4 border-gray-800 dark:border-gray-200 shadow-md border border-border rounded-lg">
                            <div className="text-muted-foreground text-sm font-bold">Total Input</div>
                            <div className="text-3xl font-bold text-foreground">{summary.total}</div>
                        </div>
                    </div>

                    {/* 2. BAGIAN ANALITIK (GRAFIK & TOP 5) - Sesuai Wireframe PDF Hal 18 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        
                        {/* GRAFIK BULANAN */}
                        <div className="md:col-span-2 bg-card p-6 shadow-sm rounded-lg">
                            <h3 className="text-lg font-bold mb-4 text-foreground">Statistik Kehadiran Bulan Ini</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyStats}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                        <XAxis dataKey="name" stroke="var(--foreground)" />
                                        <YAxis allowDecimals={false} stroke="var(--foreground)" />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                                            itemStyle={{ color: 'var(--foreground)' }}
                                        />
                                        <Bar dataKey="jumlah" radius={[4, 4, 0, 0]}>
                                            {monthlyStats.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8884d8'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* TOP 5 KELAS SERING TERLAMBAT */}
                        <div className="bg-card p-6 shadow-sm rounded-lg">
                            <h3 className="text-lg font-bold mb-4 text-foreground">Top 5 Kelas Terlambat</h3>
                            <div className="overflow-hidden">
                                <table className="min-w-full">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-bold text-muted-foreground uppercase">Kelas</th>
                                            <th className="px-4 py-2 text-right text-xs font-bold text-muted-foreground uppercase">Jml</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {topLateClasses.length > 0 ? (
                                            topLateClasses.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="px-4 py-3 font-medium text-foreground">{item.kelas}</td>
                                                    <td className="px-4 py-3 text-right text-red-600 font-bold">{item.total}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={2} className="px-4 py-4 text-center text-sm text-muted-foreground">
                                                    Belum ada data terlambat bulan ini.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* 3. TABEL RIWAYAT INPUT HARI INI */}
                    <div className="bg-card overflow-hidden shadow-md border border-border sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-4 text-foreground">Riwayat Input Hari Ini</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto border-collapse">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-2 text-left border-b border-border text-muted-foreground">No</th>
                                        <th className="px-4 py-2 text-left border-b border-border text-muted-foreground">Nama Lengkap</th>
                                        <th className="px-4 py-2 text-left border-b border-border text-muted-foreground">Kelas</th>
                                        <th className="px-4 py-2 text-left border-b border-border text-muted-foreground">Keterangan</th>
                                        <th className="px-4 py-2 text-left border-b border-border text-muted-foreground">Waktu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {todaysAttendances.length > 0 ? (
                                        todaysAttendances.map((attendance, index) => (
                                            <tr key={attendance.id} className="hover:bg-muted/50">
                                                <td className="px-4 py-2 border-b border-border text-foreground">{index + 1}</td>
                                                <td className="px-4 py-2 border-b border-border font-medium text-foreground">{attendance.student.nama}</td>
                                                <td className="px-4 py-2 border-b border-border text-foreground">{attendance.student.kelas}</td>
                                                <td className="px-4 py-2 border-b border-border">
                                                    <span className={`px-2 py-1 rounded text-xs text-white 
                                                        ${attendance.status === 'Sakit' ? 'bg-yellow-500' : 
                                                          attendance.status === 'Izin' ? 'bg-blue-500' :
                                                          attendance.status === 'Alpa' ? 'bg-red-500' :
                                                          attendance.status === 'Terlambat' ? 'bg-orange-500' : 'bg-green-500'
                                                        }`}>
                                                        {attendance.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 border-b border-border text-foreground">
                                                    {attendance.status === 'Terlambat' ? attendance.waktu_masuk : '-'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                                                Belum ada data presensi hari ini.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
