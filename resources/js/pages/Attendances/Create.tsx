import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export default function Create({ auth, students }: { auth: any, students: any[] }) {
    // Setup form
    const { data, setData, post, processing, errors, reset } = useForm({
        student_id: '',
        status: 'Sakit', // Default status sesuai wireframe biasanya negatif
        keterangan: '',
        waktu_masuk: '',
        kelas_filter: '' // State bantu untuk filter dropdown siswa
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // Using manual URL since route() might not be available
        post('/attendance', {
            onSuccess: () => reset('student_id', 'keterangan', 'waktu_masuk'), // Reset form setelah simpan
        });
    };

    // Filter siswa berdasarkan kelas yang dipilih (Opsional UX improvement)
    const filteredStudents = data.kelas_filter 
        ? students.filter(s => s.kelas === data.kelas_filter) 
        : students;

    // Ambil daftar kelas unik dari data siswa
    const classes = [...new Set(students.map(s => s.kelas))];

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
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        
                        {/* Judul Halaman Sesuai Wireframe Hal 20 */}
                        <h3 className="text-lg font-bold mb-4">Input</h3>
                        
                        <form onSubmit={submit}>
                            {/* 1. TANGGAL (Otomatis Readonly) */}
                            <div className="mb-4 flex items-center">
                                <label className="w-1/3 text-gray-700 font-bold">Tanggal</label>
                                <span className="w-2/3 text-gray-900">: {new Date().toLocaleDateString('id-ID')} (Otomatis)</span>
                            </div>

                            {/* 2. KELAS (Filter Dropdown) */}
                            <div className="mb-4 flex items-center">
                                <label className="w-1/3 text-gray-700 font-bold">Kelas</label>
                                <div className="w-2/3">
                                    <select
                                        className="w-full border rounded px-3 py-2"
                                        onChange={(e) => setData('kelas_filter', e.target.value)}
                                        value={data.kelas_filter}
                                    >
                                        <option value="">-- Pilih Kelas --</option>
                                        {classes.map((kelas: any, index) => (
                                            <option key={index} value={kelas}>{kelas}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* 3. NAMA (Dropdown Siswa) */}
                            <div className="mb-4 flex items-center">
                                <label className="w-1/3 text-gray-700 font-bold">Nama</label>
                                <div className="w-2/3">
                                    <select
                                        className="w-full border rounded px-3 py-2"
                                        value={data.student_id}
                                        onChange={(e) => setData('student_id', e.target.value)}
                                    >
                                        <option value="">-- Cari Nama --</option>
                                        {filteredStudents.map((student) => (
                                            <option key={student.id} value={student.id}>
                                                {student.nama} ({student.nis})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.student_id && <div className="text-red-500 text-sm mt-1">{errors.student_id}</div>}
                                </div>
                            </div>

                            {/* 4. KETERANGAN / STATUS (Radio Button) */}
                            <div className="mb-4 flex items-start">
                                <label className="w-1/3 text-gray-700 font-bold mt-2">Keterangan</label>
                                <div className="w-2/3 flex gap-4 mt-2">
                                    {['Sakit', 'Izin', 'Alpa', 'Terlambat'].map((statusOption) => (
                                        <label key={statusOption} className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                className="form-radio text-blue-600"
                                                name="status"
                                                value={statusOption}
                                                checked={data.status === statusOption}
                                                onChange={(e) => setData('status', e.target.value)}
                                            />
                                            <span className="ml-2">{statusOption}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* 5. ALASAN (Textarea) */}
                            <div className="mb-4 flex items-center">
                                <label className="w-1/3 text-gray-700 font-bold">Alasan</label>
                                <textarea
                                    className="w-2/3 border rounded px-3 py-2 bg-gray-100"
                                    rows={3}
                                    placeholder="Isi keterangan detail..."
                                    value={data.keterangan}
                                    onChange={(e) => setData('keterangan', e.target.value)}
                                ></textarea>
                            </div>

                            {/* 6. WAKTU MASUK (Muncul Hanya Jika Terlambat) */}
                            {data.status === 'Terlambat' && (
                                <div className="mb-4 flex items-center bg-yellow-50 p-2 rounded border border-yellow-200">
                                    <label className="w-1/3 text-yellow-800 font-bold">Waktu Masuk</label>
                                    <input
                                        type="time"
                                        className="w-2/3 border rounded px-3 py-2"
                                        value={data.waktu_masuk}
                                        onChange={(e) => setData('waktu_masuk', e.target.value)}
                                    />
                                </div>
                            )}

                            {/* TOMBOL SIMPAN */}
                            <div className="flex justify-end mt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded"
                                >
                                    Simpan
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
