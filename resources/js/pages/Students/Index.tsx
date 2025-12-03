import AppLayout from '@/layouts/app-layout';
import studentsRoutes from '@/routes/students';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Siswa',
        href: studentsRoutes.index().url,
    },
];

export default function Index({ students }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Siswa" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-end mb-6">
                            <Link
                                href="#"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                + Tambah Data Siswa
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto border-collapse border border-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-2 text-left">No</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">NIS</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Nama Lengkap</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Kelas</th>
                                        <th className="border border-gray-300 px-4 py-2 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student, index) => (
                                        <tr key={student.id} className="hover:bg-gray-50">
                                            <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                            <td className="border border-gray-300 px-4 py-2">{student.nis}</td>
                                            <td className="border border-gray-300 px-4 py-2">{student.nama}</td>
                                            <td className="border border-gray-300 px-4 py-2">{student.kelas}</td>
                                            <td className="border border-gray-300 px-4 py-2 text-center">
                                                <button className="text-yellow-500 hover:text-yellow-700 mr-2">Edit</button>
                                                <button className="text-red-500 hover:text-red-700">Hapus</button>
                                            </td>
                                        </tr>
                                    ))}

                                    {students.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4 text-gray-500">
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

