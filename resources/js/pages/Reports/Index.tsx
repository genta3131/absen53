import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

export default function Index({ auth, attendances, filters, classes }: { auth: any, attendances: any[], filters: any, classes: string[] }) {
    
    // Fungsi saat filter tanggal/kelas berubah
    const handleFilterChange = (key: string, value: string) => {
        router.get('/reports', { ...filters, [key]: value }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    // Fungsi Cetak Laporan
    const handlePrint = () => {
        window.print();
    };

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Laporan Harian',
                    href: '/reports',
                },
            ]}
        >
            <Head title="Laporan Harian" />

            {/* CSS KHUSUS CETAK: Sembunyikan elemen yang tidak perlu saat diprint */}
            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    body { background: white; }
                    .shadow-sm { box-shadow: none !important; }
                    .border { border: 1px solid #000 !important; }
                    /* Hide sidebar and header if they are not covered by no-print */
                    nav, header, aside { display: none !important; }
                    main { margin: 0 !important; padding: 0 !important; width: 100% !important; }
                }
            `}</style>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">

                        {/* FILTER & TOMBOL CETAK (Masuk kelas no-print agar hilang saat dicetak) */}
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 no-print gap-4">
                            <div className="flex gap-4 w-full md:w-auto">
                                {/* Filter Tanggal */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Tanggal:</label>
                                    <input 
                                        type="date" 
                                        value={filters.date}
                                        onChange={(e) => handleFilterChange('date', e.target.value)}
                                        className="border rounded px-3 py-2"
                                    />
                                </div>

                                {/* Filter Kelas */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700">Kelas:</label>
                                    <select 
                                        value={filters.kelas || ''}
                                        onChange={(e) => handleFilterChange('kelas', e.target.value)}
                                        className="border rounded px-3 py-2"
                                    >
                                        <option value="">Semua Kelas</option>
                                        {classes.map((cls, idx) => (
                                            <option key={idx} value={cls}>{cls}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Tombol Cetak Sesuai Wireframe Hal 19 */}
                            <button 
                                onClick={handlePrint}
                                className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Cetak Laporan
                            </button>
                        </div>

                        {/* JUDUL CETAK (Hanya muncul saat print) */}
                        <div className="hidden print-only mb-6 text-center">
                            <h1 className="text-2xl font-bold">Laporan Presensi Harian</h1>
                            <p>Tanggal: {new Date(filters.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>

                        {/* TABEL LAPORAN (Sesuai Wireframe Hal 19) */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto border-collapse border border-gray-200 w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-2 text-left">No</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Nama Lengkap</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Kelas</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Keterangan</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Alasan / Waktu</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendances.length > 0 ? (
                                        attendances.map((data, index) => (
                                            <tr key={data.id} className="hover:bg-gray-50">
                                                <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                                                <td className="border border-gray-300 px-4 py-2">{data.student.nama}</td>
                                                <td className="border border-gray-300 px-4 py-2">{data.student.kelas}</td>
                                                <td className="border border-gray-300 px-4 py-2 font-bold">
                                                    {data.status}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {data.status === 'Terlambat' 
                                                        ? `Jam Masuk: ${data.waktu_masuk}` 
                                                        : data.keterangan || '-'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                                                Tidak ada data presensi pada tanggal ini.
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
