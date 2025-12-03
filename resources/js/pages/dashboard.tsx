import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ summary, todaysAttendances }: { summary: any, todaysAttendances: any[] }) {
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
                    
                    {/* BAGIAN 1: RINGKASAN (Sesuai Wireframe Hal 17) */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                        {/* Kotak Sakit */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-yellow-500">
                            <div className="text-gray-500 text-sm font-bold">Sakit</div>
                            <div className="text-3xl font-bold text-gray-800">{summary.sakit}</div>
                        </div>
                        {/* Kotak Izin */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-blue-500">
                            <div className="text-gray-500 text-sm font-bold">Izin</div>
                            <div className="text-3xl font-bold text-gray-800">{summary.izin}</div>
                        </div>
                        {/* Kotak Alpa (Tanpa Keterangan) */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-red-500">
                            <div className="text-gray-500 text-sm font-bold">Alpa</div>
                            <div className="text-3xl font-bold text-gray-800">{summary.alpa}</div>
                        </div>
                        {/* Kotak Terlambat */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-orange-500">
                            <div className="text-gray-500 text-sm font-bold">Terlambat</div>
                            <div className="text-3xl font-bold text-gray-800">{summary.terlambat}</div>
                        </div>
                         {/* Kotak Total */}
                         <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-gray-800">
                            <div className="text-gray-500 text-sm font-bold">Total Input</div>
                            <div className="text-3xl font-bold text-gray-800">{summary.total}</div>
                        </div>
                    </div>

                    {/* BAGIAN 2: DAFTAR NAMA SISWA (TABEL) */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-4 text-gray-800">Riwayat Input Hari Ini</h3>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto border-collapse">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left border-b">No</th>
                                        <th className="px-4 py-2 text-left border-b">Nama Lengkap</th>
                                        <th className="px-4 py-2 text-left border-b">Kelas</th>
                                        <th className="px-4 py-2 text-left border-b">Keterangan</th>
                                        <th className="px-4 py-2 text-left border-b">Waktu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {todaysAttendances.length > 0 ? (
                                        todaysAttendances.map((attendance, index) => (
                                            <tr key={attendance.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 border-b">{index + 1}</td>
                                                <td className="px-4 py-2 border-b font-medium">{attendance.student.nama}</td>
                                                <td className="px-4 py-2 border-b">{attendance.student.kelas}</td>
                                                <td className="px-4 py-2 border-b">
                                                    <span className={`px-2 py-1 rounded text-xs text-white 
                                                        ${attendance.status === 'Sakit' ? 'bg-yellow-500' : 
                                                          attendance.status === 'Izin' ? 'bg-blue-500' :
                                                          attendance.status === 'Alpa' ? 'bg-red-500' :
                                                          attendance.status === 'Terlambat' ? 'bg-orange-500' : 'bg-green-500'
                                                        }`}>
                                                        {attendance.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 border-b">
                                                    {attendance.status === 'Terlambat' ? attendance.waktu_masuk : '-'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
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
