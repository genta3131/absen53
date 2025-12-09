import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Edit({ auth, student }: { auth: any, student: any }) {
    // Inisialisasi form dengan data siswa yang dikirim dari Controller
    const { data, setData, put, processing, errors } = useForm({
        nis: student.nis,
        nama: student.nama,
        kelas: student.kelas,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Gunakan method PUT untuk update
        // Using hardcoded URL as fallback if route() helper is not available/configured correctly
        put(`/students/${student.id}`);
    };

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Data Siswa',
                    href: '/students',
                },
                {
                    title: 'Edit Siswa',
                    href: `/students/${student.id}/edit`,
                },
            ]}
        >
            <Head title="Edit Siswa" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-card overflow-hidden shadow-md border border-border sm:rounded-lg p-6">
                        
                        <form onSubmit={submit}>
                            {/* Input NIS */}
                            <div className="mb-4">
                                <label className="block text-foreground text-sm font-bold mb-2">NIS</label>
                                <input
                                    type="text"
                                    className="shadow appearance-none border border-border rounded w-full py-2 px-3 text-foreground bg-background leading-tight focus:outline-none focus:shadow-outline"
                                    value={data.nis}
                                    onChange={(e) => setData('nis', e.target.value)}
                                />
                                {errors.nis && <div className="text-destructive text-sm mt-1">{errors.nis}</div>}
                            </div>

                            {/* Input Nama */}
                            <div className="mb-4">
                                <label className="block text-foreground text-sm font-bold mb-2">Nama Lengkap</label>
                                <input
                                    type="text"
                                    className="shadow appearance-none border border-border rounded w-full py-2 px-3 text-foreground bg-background leading-tight focus:outline-none focus:shadow-outline"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                />
                                {errors.nama && <div className="text-destructive text-sm mt-1">{errors.nama}</div>}
                            </div>

                            {/* Input Kelas */}
                            <div className="mb-4">
                                <label className="block text-foreground text-sm font-bold mb-2">Kelas</label>
                                <select
                                    className="shadow border border-border rounded w-full py-2 px-3 text-foreground bg-background leading-tight focus:outline-none focus:shadow-outline"
                                    value={data.kelas}
                                    onChange={(e) => setData('kelas', e.target.value)}
                                >
                                    <option value="">Pilih Kelas</option>
                                    {['X', 'XI', 'XII'].map((level) => (
                                        Array.from({ length: 7 }, (_, i) => i + 1).map((num) => (
                                            <option key={`${level}-${num}`} value={`${level}-${num}`}>
                                                {`${level}-${num}`}
                                            </option>
                                        ))
                                    ))}
                                </select>
                                {errors.kelas && <div className="text-destructive text-sm mt-1">{errors.kelas}</div>}
                            </div>

                            <div className="flex items-center justify-end mt-4">
                                <Link href="/students" className="text-muted-foreground hover:text-foreground mr-4">
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Update Data
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
