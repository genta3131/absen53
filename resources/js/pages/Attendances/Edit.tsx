import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Edit({ auth, attendance }: { auth: any, attendance: any }) {
    const { data, setData, put, processing, errors } = useForm({
        status: attendance.status,
        keterangan: attendance.keterangan || '',
        waktu_masuk: attendance.waktu_masuk || '',
        alasan_koreksi: '', // Field wajib baru
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/attendance/${attendance.id}`);
    };

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Koreksi Data Presensi',
                    href: '#',
                },
            ]}
        >
            <Head title="Koreksi Presensi" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-card overflow-hidden shadow-md border border-border sm:rounded-lg p-6">
                        
                        <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded border border-blue-200 dark:border-blue-800">
                            <h3 className="font-bold text-lg text-blue-800 dark:text-blue-300">Data Siswa</h3>
                            <p className="text-foreground">Nama: <strong>{attendance.student.nama}</strong></p>
                            <p className="text-foreground">Tanggal: {attendance.tanggal}</p>
                        </div>

                        <form onSubmit={submit}>
                            {/* PILIH STATUS BARU */}
                            <div className="mb-4">
                                <label className="block text-foreground font-bold mb-2">Status Kehadiran (Revisi)</label>
                                <div className="flex gap-4 mt-2">
                                    {['Hadir', 'Sakit', 'Izin', 'Alpa', 'Terlambat'].map((opt) => (
                                        <label key={opt} className="inline-flex items-center text-foreground">
                                            <input
                                                type="radio"
                                                className="form-radio text-primary"
                                                name="status"
                                                value={opt}
                                                checked={data.status === opt}
                                                onChange={(e) => setData('status', e.target.value)}
                                            />
                                            <span className="ml-2">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* KETERANGAN */}
                            <div className="mb-4">
                                <label className="block text-foreground font-bold mb-2">Keterangan Tambahan</label>
                                <textarea
                                    className="w-full border border-border rounded px-3 py-2 bg-background text-foreground"
                                    rows={2}
                                    value={data.keterangan}
                                    onChange={(e) => setData('keterangan', e.target.value)}
                                ></textarea>
                            </div>

                            {/* WAKTU MASUK (Jika Terlambat) */}
                            {data.status === 'Terlambat' && (
                                <div className="mb-4">
                                    <label className="block text-foreground font-bold mb-2">Waktu Masuk</label>
                                    <input
                                        type="time"
                                        className="border border-border rounded px-3 py-2 bg-background text-foreground"
                                        value={data.waktu_masuk}
                                        onChange={(e) => setData('waktu_masuk', e.target.value)}
                                    />
                                </div>
                            )}

                            <hr className="my-6 border-border" />

                            {/* ALASAN KOREKSI (WAJIB) */}
                            <div className="mb-4">
                                <label className="block text-destructive font-bold mb-2">Alasan Koreksi (Wajib Diisi)</label>
                                <input
                                    type="text"
                                    className="w-full border border-destructive/50 rounded px-3 py-2 bg-destructive/10 text-foreground placeholder:text-muted-foreground"
                                    placeholder="Contoh: Salah input, siswa ternyata sakit..."
                                    value={data.alasan_koreksi}
                                    onChange={(e) => setData('alasan_koreksi', e.target.value)}
                                    required
                                    autoFocus
                                />
                                {errors.alasan_koreksi && <div className="text-destructive text-sm mt-1">{errors.alasan_koreksi}</div>}
                            </div>

                            <div className="flex justify-end gap-4">
                                <Link
                                    href="/reports"
                                    className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold py-2 px-4 rounded"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded"
                                >
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
