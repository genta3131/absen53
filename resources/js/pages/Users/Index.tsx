import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, users }: { auth: any, users: any[] }) {
    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Manajemen Pengguna',
                    href: '/users',
                },
            ]}
        >
            <Head title="Kelola Akun" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">

                        <div className="flex justify-end mb-6">
                            <Link
                                href="/users/create"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                + Tambah Akun Baru
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto border-collapse border border-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border px-4 py-2 text-left">Nama</th>
                                        <th className="border px-4 py-2 text-left">Email</th>
                                        <th className="border px-4 py-2 text-left">Peran (Role)</th>
                                        <th className="border px-4 py-2 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="border px-4 py-2">{user.name}</td>
                                            <td className="border px-4 py-2">{user.email}</td>
                                            <td className="border px-4 py-2 capitalize">{user.role.replace('_', ' ')}</td>
                                            <td className="border px-4 py-2 text-center">
                                                <Link
                                                    href={`/users/${user.id}/edit`}
                                                    className="text-yellow-600 hover:text-yellow-800 font-bold mr-3"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Hapus akun ini?')) {
                                                            router.delete(`/users/${user.id}`);
                                                        }
                                                    }}
                                                    className="text-red-600 hover:text-red-800 font-bold"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
