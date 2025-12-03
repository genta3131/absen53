import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ auth, userToEdit }: { auth: any, userToEdit: any }) {
    const { data, setData, put, processing, errors } = useForm({
        name: userToEdit.name,
        email: userToEdit.email,
        role: userToEdit.role,
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/users/${userToEdit.id}`);
    };

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Manajemen Pengguna',
                    href: '/users',
                },
                {
                    title: 'Edit Akun',
                    href: `/users/${userToEdit.id}/edit`,
                },
            ]}
        >
            <Head title="Edit Akun" />
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">Nama</label>
                                <input type="text" className="w-full border rounded px-3 py-2"
                                    value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">Email</label>
                                <input type="email" className="w-full border rounded px-3 py-2"
                                    value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">Peran</label>
                                <select className="w-full border rounded px-3 py-2"
                                    value={data.role} onChange={(e) => setData('role', e.target.value)}>
                                    <option value="guru_piket">Guru Piket</option>
                                    <option value="guru_mapel">Guru Mapel</option>
                                    <option value="staf_tu">Staf TU</option>
                                    <option value="kepsek">Kepala Sekolah</option>
                                </select>
                            </div>
                            <div className="mb-4 bg-yellow-50 p-3 rounded">
                                <label className="block text-gray-700 font-bold mb-2">Ubah Password (Opsional)</label>
                                <input type="password" className="w-full border rounded px-3 py-2 mb-2" placeholder="Password Baru"
                                    value={data.password} onChange={(e) => setData('password', e.target.value)} />
                                <input type="password" className="w-full border rounded px-3 py-2" placeholder="Konfirmasi Password Baru"
                                    value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
                                <p className="text-xs text-gray-500 mt-1">Kosongkan jika tidak ingin mengubah password.</p>
                            </div>

                            <div className="flex justify-end">
                                <button type="submit" disabled={processing} className="bg-yellow-500 text-white px-4 py-2 rounded">
                                    Update Akun
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
