import AppLayout from '@/layouts/app-layout';
import { Head, router, Link } from '@inertiajs/react';
import Pagination from '@/components/Pagination';

export default function Index({ auth, attendances, filters, classes }: { auth: any, attendances: any, filters: any, classes: string[] }) {
    
    // Fungsi saat filter tanggal/kelas berubah
    const handleFilterChange = (key: string, value: string) => {
        router.get('/reports', { ...filters, [key]: value }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    // Default dates if not present
    const startDate = filters.startDate || new Date().toISOString().split('T')[0];
    const endDate = filters.endDate || new Date().toISOString().split('T')[0];

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
                    <div className="bg-card overflow-hidden shadow-md border border-border sm:rounded-lg p-6">

                        {/* FILTER & TOMBOL CETAK (Masuk kelas no-print agar hilang saat dicetak) */}
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 no-print gap-4">
                            <div className="flex gap-4 w-full md:w-auto">
                                {/* Filter Tanggal Awal */}
                                <div>
                                    <label className="block text-sm font-bold text-foreground">Tanggal Awal:</label>
                                    <input 
                                        type="date" 
                                        value={startDate}
                                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                        className="border border-border rounded px-3 py-2 bg-background text-foreground"
                                    />
                                </div>

                                {/* Filter Tanggal Akhir */}
                                <div>
                                    <label className="block text-sm font-bold text-foreground">Tanggal Akhir:</label>
                                    <input 
                                        type="date" 
                                        value={endDate}
                                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                        className="border border-border rounded px-3 py-2 bg-background text-foreground"
                                    />
                                </div>

                                {/* Filter Kelas */}
                                <div>
                                    <label className="block text-sm font-bold text-foreground">Kelas:</label>
                                    <select 
                                        value={filters.kelas || ''}
                                        onChange={(e) => handleFilterChange('kelas', e.target.value)}
                                        className="border border-border rounded px-3 py-2 bg-background text-foreground"
                                    >
                                        <option value="">Semua Kelas</option>
                                        {classes.map((cls, idx) => (
                                            <option key={idx} value={cls}>{cls}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Tombol Cetak & Export */}
                            <div className="flex gap-2">
                                <button 
                                    onClick={handlePrint}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                    Cetak
                                </button>

                                <a 
                                    href={`/reports/export/excel?startDate=${startDate}&endDate=${endDate}&kelas=${filters.kelas || ''}`}
                                    target="_blank"
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Excel
                                </a>

                                <a 
                                    href={`/reports/export/pdf?startDate=${startDate}&endDate=${endDate}&kelas=${filters.kelas || ''}`}
                                    target="_blank"
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    PDF
                                </a>
                            </div>
                        </div>

                        {/* JUDUL CETAK (Hanya muncul saat print) */}
                        <div className="hidden print-only mb-6 text-center">
                            <h1 className="text-2xl font-bold">Laporan Presensi Harian</h1>
                            <p>Tanggal: {new Date(startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} - {new Date(endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>

                        {/* TABEL LAPORAN (Sesuai Wireframe Hal 19) */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto border-collapse border border-border w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="border border-border px-4 py-2 text-left text-foreground">No</th>
                                        <th className="border border-border px-4 py-2 text-left text-foreground">Nama Lengkap</th>
                                        <th className="border border-border px-4 py-2 text-left text-foreground">Kelas</th>
                                        <th className="border border-border px-4 py-2 text-left text-foreground">Keterangan</th>
                                        <th className="border border-border px-4 py-2 text-left text-foreground">Alasan / Waktu</th>
                                        <th className="border border-border px-4 py-2 text-center no-print text-foreground">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendances.data.length > 0 ? (
                                        attendances.data.map((data: any, index: number) => (
                                            <tr key={data.id} className="hover:bg-muted/50">
                                                <td className="border border-border px-4 py-2 text-center text-foreground">{index + 1}</td>
                                                <td className="border border-border px-4 py-2 text-foreground">{data.student.nama}</td>
                                                <td className="border border-border px-4 py-2 text-foreground">{data.student.kelas}</td>
                                                <td className="border border-border px-4 py-2 font-bold text-foreground">
                                                    {data.status}
                                                </td>
                                                <td className="border border-border px-4 py-2 text-foreground">
                                                    {data.status === 'Terlambat' 
                                                        ? `Jam Masuk: ${data.waktu_masuk}` 
                                                        : data.keterangan || '-'}
                                                </td>
                                                <td className="border border-border px-4 py-2 text-center no-print">
                                                    <Link
                                                        href={`/attendance/${data.id}/edit`}
                                                        className="text-primary hover:text-primary/80 font-bold text-sm underline"
                                                    >
                                                        Koreksi
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="border border-border px-4 py-8 text-center text-muted-foreground">
                                                Tidak ada data presensi pada tanggal ini.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination links={attendances.links} className="mt-6 no-print" />

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
