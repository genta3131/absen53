import AppLayout from '@/layouts/app-layout';
import studentsRoutes from '@/routes/students';
import { Head, useForm, Link } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Create({ auth }: { auth: any }) {
    // Setup state form (Inertia useForm handle value & processing)
    const { data, setData, post, processing, errors } = useForm({
        nis: '',
        nama: '',
        kelas: '',
    });

    // Fungsi saat tombol Simpan ditekan
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(studentsRoutes.store().url);
    };

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Tambah Siswa',
                    href: studentsRoutes.create().url,
                },
            ]}
        >
            <Head title="Tambah Siswa" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        
                        <form onSubmit={submit}>
                            {/* Input NIS */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">NIS</label>
                                <input
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={data.nis}
                                    onChange={(e) => setData('nis', e.target.value)}
                                    placeholder="Contoh: 1512622026"
                                />
                                {errors.nis && <div className="text-red-500 text-sm mt-1">{errors.nis}</div>}
                            </div>

                            {/* Input Nama Lengkap */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Nama Lengkap</label>
                                <input
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    placeholder="Nama Siswa"
                                />
                                {errors.nama && <div className="text-red-500 text-sm mt-1">{errors.nama}</div>}
                            </div>

                            {/* Input Kelas */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Kelas</label>
                                <select
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={data.kelas}
                                    onChange={(e) => setData('kelas', e.target.value)}
                                >
                                    <option value="">Pilih Kelas</option>
                                    <option value="X-RPL">X-RPL</option>
                                    <option value="XI-RPL">XI-RPL</option>
                                    <option value="XII-RPL">XII-RPL</option>
                                    <option value="XII-TKJ">XII-TKJ</option>
                                </select>
                                {errors.kelas && <div className="text-red-500 text-sm mt-1">{errors.kelas}</div>}
                            </div>

                            {/* Tombol Aksi */}
                            <div className="flex items-center justify-end mt-4">
                                <Link
                                    href={studentsRoutes.index().url}
                                    className="text-gray-600 hover:text-gray-900 mr-4"
                                >
                                    Batal
                                </Link>
                                
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
