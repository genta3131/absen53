import AppLayout from '@/layouts/app-layout';

import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Pagination from '@/components/Pagination';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Siswa',
        href: '/students',
    },
];

interface Student {
    id: number;
    nis: string;
    nama: string;
    kelas: string;
}

interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

interface PageProps {
    students: {
        data: Student[];
        links: PaginationLinks[];
    };
    filters: {
        search?: string;
        kelas?: string;
    };
    classes: string[];
}

export default function Index({ students, filters, classes }: PageProps) {
    const { flash, auth } = usePage<any>().props;
    const userRole = auth?.user?.role;
    const [search, setSearch] = useState(filters.search || '');
    const [kelas, setKelas] = useState(filters.kelas || '');

    // Debounce search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search !== (filters.search || '')) {
                router.get(
                    '/students',
                    { search, kelas },
                    { preserveState: true, replace: true }
                );
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newKelas = e.target.value;
        setKelas(newKelas);
        router.get(
            '/students',
            { search, kelas: newKelas },
            { preserveState: true, replace: true }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Siswa" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {flash?.message && (
                        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Berhasil!</strong>
                            <span className="block sm:inline"> {flash.message}</span>
                        </div>
                    )}
                    <div className="bg-card overflow-hidden shadow-md border border-border sm:rounded-lg p-6">
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

                            <div className="flex gap-2">
                                {userRole === 'staf_tu' && (
                                    <>
                                        <ImportModal />
                                        <Link
                                            href="/students/promotion"
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Kenaikan Kelas
                                        </Link>
                                        <Link
                                            href="/students/create"
                                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded"
                                        >
                                            + Tambah Data Siswa
                                        </Link>
                                    </>
                                )}
                            </div>
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
                                    {students.data.map((student, index) => (
                                        <tr key={student.nis} className="hover:bg-muted/50">
                                            <td className="border border-border px-4 py-2 text-center text-foreground">{index + 1}</td>
                                            <td className="border border-border px-4 py-2 text-foreground">{student.nis}</td>
                                            <td className="border border-border px-4 py-2 text-foreground">{student.nama}</td>
                                            <td className="border border-border px-4 py-2 text-center text-foreground">{student.kelas}</td>
                                            <td className="border border-border px-4 py-2 text-center">
                                                
                                                {userRole === 'staf_tu' && (
                                                    <>
                                                        {/* TOMBOL EDIT */}
                                                        <Link
                                                            href={`/students/${student.nis}/edit`}
                                                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-sm mr-2"
                                                        >
                                                            Edit
                                                        </Link>
        
                                                        {/* TOMBOL HAPUS */}
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('Yakin ingin menghapus siswa ini? Data presensinya juga akan hilang.')) {
                                                                    router.delete(`/students/${student.nis}`);
                                                                }
                                                            }}
                                                            className="bg-destructive hover:bg-destructive/90 text-white font-bold py-1 px-3 rounded text-sm"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </>
                                                )}
                                                
                                            </td>
                                        </tr>
                                    ))}

                                    {students.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center py-4 text-muted-foreground">
                                                Belum ada data siswa.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination links={students.links} className="mt-6" />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function ImportModal() {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        file: null as File | null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/students/import', {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="bg-green-600 text-white hover:bg-green-700 hover:text-white border-green-600">
                    Import Excel
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Import Data Siswa</DialogTitle>
                    <DialogDescription>
                        Upload file Excel (.xlsx, .xls) dengan kolom: nis, nama, kelas.
                        <br />
                        <a href="/students/import/template" className="text-blue-600 hover:underline text-sm">
                            Download Template Excel
                        </a>
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="file" className="text-right">
                            File
                        </Label>
                        <Input
                            id="file"
                            type="file"
                            accept=".xlsx, .xls"
                            className="col-span-3"
                            onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                        />
                    </div>
                    {errors.file && <div className="text-red-500 text-sm text-right">{errors.file}</div>}
                    <DialogFooter>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Mengupload...' : 'Import'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

