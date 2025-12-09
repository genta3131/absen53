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
                    <div className="bg-card overflow-hidden shadow-md border border-border sm:rounded-lg p-6">

                        <div className="flex justify-end mb-6">
                            <Link
                                href="/users/create"
                                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded"
                            >
                                + Tambah Akun Baru
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto border-collapse border border-border">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="border border-border px-4 py-2 text-left text-foreground">Nama</th>
                                        <th className="border border-border px-4 py-2 text-left text-foreground">Email</th>
                                        <th className="border border-border px-4 py-2 text-left text-foreground">Peran (Role)</th>
                                        <th className="border border-border px-4 py-2 text-center text-foreground">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-muted/50">
                                            <td className="border border-border px-4 py-2 text-foreground">{user.name}</td>
                                            <td className="border border-border px-4 py-2 text-foreground">{user.email}</td>
                                            <td className="border border-border px-4 py-2 capitalize text-foreground">{user.role.replace('_', ' ')}</td>
                                            <td className="border border-border px-4 py-2 text-center">
                                                <Link
                                                    href={`/users/${user.id}/edit`}
                                                    className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 font-bold mr-3"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Hapus akun ini?')) {
                                                            router.delete(`/users/${user.id}`);
                                                        }
                                                    }}
                                                    className="text-destructive hover:text-destructive/80 font-bold"
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
