import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';

export default function Create({ auth, classes, students, selectedClass }: { auth: any, classes: string[], students: any[], selectedClass: string }) {
    // State untuk data presensi bulk
    const { data, setData, post, processing, errors } = useForm({
        attendances: [] as any[]
    });

    // Inisialisasi data form saat students berubah
    useEffect(() => {
        if (students.length > 0) {
            const initialData = students.map(student => ({
                student_id: student.id,
                // Jika ada data presensi hari ini, gunakan. Jika tidak, default Hadir.
                status: student.today_attendance ? student.today_attendance.status : 'Hadir',
                keterangan: student.today_attendance ? (student.today_attendance.keterangan || '') : '',
                waktu_masuk: student.today_attendance ? (student.today_attendance.waktu_masuk || '') : ''
            }));
            setData('attendances', initialData);
        }
    }, [students]);

    // Handle perubahan status/keterangan per siswa
    const handleAttendanceChange = (index: number, field: string, value: any) => {
        const newAttendances = [...data.attendances];
        newAttendances[index] = { ...newAttendances[index], [field]: value };
        setData('attendances', newAttendances);
    };

    // Handle ganti kelas
    const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newClass = e.target.value;
        router.get('/attendance/input', { kelas: newClass });
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/attendance');
    };

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Input Presensi',
                    href: '/attendance/input',
                },
            ]}
        >
            <Head title="Input Presensi" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-card overflow-hidden shadow-sm sm:rounded-lg p-6">
                        
                        <h3 className="text-lg font-bold mb-6 text-foreground">Input Presensi Harian</h3>

                        {/* PILIH KELAS */}
                        <div className="mb-6">
                            <label className="block text-foreground font-bold mb-2">Pilih Kelas:</label>
                            <select
                                className="border border-border rounded px-3 py-2 w-full md:w-1/3 bg-background text-foreground"
                                onChange={handleClassChange}
                                value={selectedClass || ''}
                            >
                                <option value="">-- Pilih Kelas --</option>
                                {classes.map((cls, idx) => (
                                    <option key={idx} value={cls}>{cls}</option>
                                ))}
                            </select>
                        </div>

                        {/* TABEL INPUT BULK */}
                        {selectedClass && students.length > 0 && (
                            <form onSubmit={submit}>
                                <div className="overflow-x-auto mb-6">
                                    <table className="min-w-full table-auto border-collapse border border-border">
                                        <thead className="bg-muted/50">
                                            <tr>
                                                <th className="border border-border px-4 py-2 text-left text-foreground">No</th>
                                                <th className="border border-border px-4 py-2 text-left text-foreground">Nama Siswa</th>
                                                <th className="border border-border px-4 py-2 text-left text-foreground">Status Kehadiran</th>
                                                <th className="border border-border px-4 py-2 text-left text-foreground">Keterangan</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.map((student, index) => (
                                                <tr key={student.id} className="hover:bg-muted/50">
                                                    <td className="border border-border px-4 py-2 text-center text-foreground">{index + 1}</td>
                                                    <td className="border border-border px-4 py-2">
                                                        <div className="font-bold text-foreground">{student.nama}</div>
                                                        <div className="text-sm text-muted-foreground">{student.nis}</div>
                                                    </td>
                                                    <td className="border border-border px-4 py-2">
                                                        <div className="flex flex-wrap gap-4">
                                                            {['Hadir', 'Sakit', 'Izin', 'Alpa', 'Terlambat'].map((opt) => (
                                                                <label key={opt} className="inline-flex items-center cursor-pointer">
                                                                    <input
                                                                        type="radio"
                                                                        className="form-radio text-primary"
                                                                        name={`status-${index}`}
                                                                        value={opt}
                                                                        checked={data.attendances[index]?.status === opt}
                                                                        onChange={(e) => handleAttendanceChange(index, 'status', e.target.value)}
                                                                    />
                                                                    <span className="ml-2 text-sm text-foreground">{opt}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                        {/* Input Waktu jika Terlambat */}
                                                        {data.attendances[index]?.status === 'Terlambat' && (
                                                            <div className="mt-2">
                                                                <input
                                                                    type="time"
                                                                    className="border border-border rounded px-2 py-1 text-sm bg-background text-foreground"
                                                                    value={data.attendances[index]?.waktu_masuk || ''}
                                                                    onChange={(e) => handleAttendanceChange(index, 'waktu_masuk', e.target.value)}
                                                                    placeholder="Jam Masuk"
                                                                />
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="border border-border px-4 py-2">
                                                        <textarea
                                                            className="w-full border border-border rounded px-2 py-1 text-sm bg-background text-foreground"
                                                            rows={1}
                                                            placeholder="Catatan..."
                                                            value={data.attendances[index]?.keterangan || ''}
                                                            onChange={(e) => handleAttendanceChange(index, 'keterangan', e.target.value)}
                                                        ></textarea>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-8 rounded shadow-lg"
                                    >
                                        Simpan Presensi Kelas {selectedClass}
                                    </button>
                                </div>
                            </form>
                        )}

                        {selectedClass && students.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                Belum ada siswa di kelas ini.
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
