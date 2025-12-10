import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import React from 'react';

// Add global declaration for Ziggy's route function (Removed as we use hardcoded paths)


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Siswa',
        href: '/students',
    },
    {
        title: 'Kenaikan Kelas',
        href: '/students/promotion',
    },
];

interface Student {
    id: number;
    nis: string;
    nama: string;
    kelas: string;
}

interface Props {
    classes: string[];
    students: Student[];
    filters: {
        source_class?: string;
    };
}

export default function Promotion({ classes, students, filters }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        source_class: filters.source_class || '',
        destination_class: '',
        student_nises: [] as string[],
    });

    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

    // Generate possible classes
    const possibleClasses: string[] = [];
    ['X', 'XI', 'XII'].forEach(level => {
        for (let i = 1; i <= 7; i++) {
            possibleClasses.push(`${level}-${i}`);
        }
    });
    // Add graduation options
    possibleClasses.push('Lulus');


    // Handle source class change (FETCH students)
    const handleSourceClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newClass = e.target.value;
        setData('source_class', newClass); // Update form data too
        
        router.get(
            '/students/promotion',
            { source_class: newClass },
            { preserveState: true, replace: true }
        );
    };

    // Update form data regarding student IDs when selection changes
    useEffect(() => {
        setData('student_nises', selectedStudents);
    }, [selectedStudents]);


    const toggleSelectAll = (checked: boolean | string) => {
        if (checked === true) {
            setSelectedStudents(students.map(s => s.nis));
        } else {
            setSelectedStudents([]);
        }
    };

    const toggleStudent = (nis: string) => {
        if (selectedStudents.includes(nis)) {
            setSelectedStudents(selectedStudents.filter(sId => sId !== nis));
        } else {
            setSelectedStudents([...selectedStudents, nis]);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (confirm(`Yakin ingin memindahkan ${selectedStudents.length} siswa ke kelas ${data.destination_class}?`)) {
            post('/students/promotion');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kenaikan Kelas" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Kenaikan Kelas / Kelulusan Massal</CardTitle>
                            <CardDescription>
                                Pindahkan siswa dari satu kelas ke kelas lain atau set sebagai 'Lulus'.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* KELAS ASAL */}
                                    <div className="space-y-2">
                                        <Label htmlFor="source_class">Kelas Asal</Label>
                                        <select
                                            id="source_class"
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                            value={filters.source_class || ''} // Use filters for the controlled value of the selector to match URL
                                            onChange={handleSourceClassChange}
                                        >
                                            <option value="">-- Pilih Kelas Asal --</option>
                                            {classes.map((cls, idx) => (
                                                <option key={idx} value={cls}>{cls}</option>
                                            ))}
                                        </select>
                                        {errors.source_class && <p className="text-red-500 text-sm">{errors.source_class}</p>}
                                    </div>

                                    {/* KELAS TUJUAN */}
                                    <div className="space-y-2">
                                        <Label htmlFor="destination_class">Kelas Tujuan (Baru / Lulus)</Label>
                                        <select
                                            id="destination_class"
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                            value={data.destination_class}
                                            onChange={e => setData('destination_class', e.target.value)}
                                        >
                                            <option value="">-- Pilih Tujuan --</option>
                                            {possibleClasses.map((cls, idx) => (
                                                <option key={idx} value={cls}>{cls}</option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-muted-foreground">Pilih kelas tujuan atau status kelulusan.</p>
                                        {errors.destination_class && <p className="text-red-500 text-sm">{errors.destination_class}</p>}
                                    </div>
                                </div>

                                {/* DAFTAR SISWA */}
                                {filters.source_class && students && (
                                    <div className="border rounded-md p-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-semibold">Daftar Siswa di {filters.source_class}</h3>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox 
                                                    id="select-all" 
                                                    checked={students.length > 0 && selectedStudents.length === students.length}
                                                    onCheckedChange={toggleSelectAll}
                                                />
                                                <Label htmlFor="select-all">Pilih Semua ({students.length})</Label>
                                            </div>
                                        </div>

                                        <div className="max-h-96 overflow-y-auto space-y-2">
                                            {students.map(student => (
                                                <div key={student.nis} className="flex items-center space-x-2 p-2 hover:bg-muted rounded border border-transparent hover:border-border">
                                                    <Checkbox 
                                                        id={`student-${student.nis}`} 
                                                        checked={selectedStudents.includes(student.nis)}
                                                        onCheckedChange={() => toggleStudent(student.nis)}
                                                    />
                                                    <Label htmlFor={`student-${student.nis}`} className="cursor-pointer flex-grow">
                                                        <span className="font-medium">{student.nama}</span>
                                                        <span className="text-muted-foreground ml-2 text-sm">({student.nis})</span>
                                                    </Label>
                                                </div>
                                            ))}
                                            {students.length === 0 && (
                                                <p className="text-muted-foreground text-center py-4">Tidak ada siswa di kelas ini.</p>
                                            )}
                                        </div>
                                        {errors.student_nises && <p className="text-red-500 text-sm mt-2">{errors.student_nises}</p>}
                                    </div>
                                )}

                                <div className="flex justify-end">
                                    <Button type="submit" disabled={processing || selectedStudents.length === 0 || !data.destination_class}>
                                        Processing {selectedStudents.length} Siswa
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
