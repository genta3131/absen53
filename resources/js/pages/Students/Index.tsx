import AppLayout from '@/layouts/app-layout';
import studentsRoutes from '@/routes/students';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react'; // Import hooks

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Siswa',
        href: studentsRoutes.index().url,
    },
];

export default function Index({ students, filters, classes }) { // Receive filters & classes
    const [search, setSearch] = useState(filters.search || '');
    const [kelas, setKelas] = useState(filters.kelas || '');

    // Debounce search to avoid too many requests
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(
                    studentsRoutes.index().url,
                    { search, kelas },
                    { preserveState: true, replace: true }
                );
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    // Handle class filter change immediately
    const handleClassChange = (e) => {
        const newKelas = e.target.value;
        setKelas(newKelas);
        router.get(
            studentsRoutes.index().url,
            { search, kelas: newKelas },
            { preserveState: true, replace: true }
        );
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Siswa" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-card overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                            {/* SEARCH & FILTER */}
                            <div className="flex gap-4 w-full md:w-auto">
                                <input
                                    type="text"
                                    placeholder="Cari Nama / NIS..."
                                    className="border border-border rounded px-3 py-2 w-full md:w-64 bg-background text-foreground"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <select
                                    className="border border-border rounded px-3 py-2 w-full md:w-48 bg-background text-foreground"
                                    value={kelas}
                                    onChange={handleClassChange}
                                >
                                    <option value="">Semua Kelas</option>
                                    {classes.map((cls, idx) => (
                                        <option key={idx} value={cls}>{cls}</option>
                                    ))}
                                </select>
                            </div>

                            <Link
                                href={studentsRoutes.create().url}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded"
                            >
                                + Tambah Data Siswa
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto border-collapse border border-border">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="border border-border px-4 py-2 text-left text-foreground">No</th>
                                        <th className="border border-border px-4 py-2 text-left text-foreground">NIS</th>
                                        <th className="border border-border px-4 py-2 text-left text-foreground">Nama Lengkap</th>
                                        <th className="border border-border px-4 py-2 text-left text-foreground">Kelas</th>
                                        <th className="border border-border px-4 py-2 text-center text-foreground">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student, index) => (
                                        <tr key={student.id} className="hover:bg-muted/50">
                                            <td className="border border-border px-4 py-2 text-center text-foreground">{index + 1}</td>
                                            <td className="border border-border px-4 py-2 text-foreground">{student.nis}</td>
                                            <td className="border border-border px-4 py-2 text-foreground">{student.nama}</td>
                                            <td className="border border-border px-4 py-2 text-center text-foreground">{student.kelas}</td>
                                            <td className="border border-border px-4 py-2 text-center">
                                                
                                                {/* TOMBOL EDIT */}
                                                <Link
                                                    href={`/students/${student.id}/edit`}
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-sm mr-2"
                                                >
                                                    Edit
                                                </Link>

                                                {/* TOMBOL HAPUS */}
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Yakin ingin menghapus siswa ini? Data presensinya juga akan hilang.')) {
                                                            router.delete(`/students/${student.id}`);
                                                        }
                                                    }}
                                                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold py-1 px-3 rounded text-sm"
                                                >
                                                    Hapus
                                                </button>
                                                
                                            </td>
                                        </tr>
                                    ))}

                                    {students.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4 text-muted-foreground">
                                                Belum ada data siswa.
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

