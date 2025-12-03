import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ auth }: { auth: any }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        role: 'guru_piket',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/users');
    };

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Manajemen Pengguna',
                    href: '/users',
                },
                {
                    title: 'Tambah Akun',
                    href: '/users/create',
                },
            ]}
        >
            <Head title="Tambah Akun" />
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit}>
                            {/* Nama */}
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">Nama</label>
                                <input type="text" className="w-full border rounded px-3 py-2"
                                    value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                            </div>
                            {/* Email */}
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">Email</label>
                                <input type="email" className="w-full border rounded px-3 py-2"
                                    value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                            </div>
                            {/* Role */}
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
                            {/* Password */}
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">Password</label>
                                <input type="password" className="w-full border rounded px-3 py-2"
                                    value={data.password} onChange={(e) => setData('password', e.target.value)} />
                                {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2">Konfirmasi Password</label>
                                <input type="password" className="w-full border rounded px-3 py-2"
                                    value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
                            </div>

                            <div className="flex justify-end">
                                <button type="submit" disabled={processing} className="bg-blue-600 text-white px-4 py-2 rounded">
                                    Simpan Akun
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
