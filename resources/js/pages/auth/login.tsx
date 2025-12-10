import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Head, useForm } from '@inertiajs/react'; // Kept useForm from inertia, removed Link if not used directly or kept if needed. Link IS used in TextLink? No TextLink wraps Link? TextLink imports Link? TextLink href expects string. 
import AppLogoIcon from '@/components/app-logo-icon';
import { FormEventHandler, useEffect } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        const rememberedEmail = localStorage.getItem('remembered_email');
        if (rememberedEmail) {
            setData('email', rememberedEmail);
            setData('remember', true);
        }
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (data.remember) {
            localStorage.setItem('remembered_email', data.email);
        } else {
            localStorage.removeItem('remembered_email');
        }

        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex min-h-screen w-full">
            <Head title="Masuk" />
            
            {/* Left Side - Image & Branding */}
            <div className="hidden lg:flex w-1/2 relative bg-blue-900 items-center justify-start overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-blue-950 opacity-90 z-10" />
                <img 
                    src="/Labkom-Prodi-2-2-min-scaled.jpg" 
                    alt="Background" 
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
                />
                
                <div className="relative z-20 text-white px-20 py-12 max-w-2xl">
                    <div className="mb-8 animate-fade-in-up">
                        <AppLogoIcon className="w-20 h-20 fill-white mb-6" />
                        <h1 className="text-5xl font-bold mb-4 tracking-tight">LIGAPRES</h1>
                        <p className="text-blue-100 text-xl font-light leading-relaxed">
                            Sistem Presensi Digital SMAN 53 Jakarta
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 mt-12 text-blue-200/80 text-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span>Real-time Tracking</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <span>Laporan Otomatis</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
                <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
                    <div className="text-center space-y-2">
                        <div className="lg:hidden flex justify-center mb-4">
                            <AppLogoIcon className="w-12 h-12 fill-blue-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                            Selamat Datang
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400">
                            Masuk ke akun LIGAPRES Anda
                        </p>
                    </div>

                    {status && (
                        <div className="p-4 rounded-lg bg-green-50 text-green-600 text-sm font-medium border border-green-100 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="nama@sekolah.sch.id"
                                    className="h-11 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">Password</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href="/forgot-password"
                                            className="text-sm font-medium text-blue-600 hover:text-blue-500"
                                            tabIndex={5}
                                        >
                                            Lupa password?
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="h-11 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <Checkbox
                                id="remember"
                                name="remember"
                                tabIndex={3}
                                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                checked={data.remember}
                                onCheckedChange={(checked) => setData('remember', checked === true)}
                            />
                            <Label htmlFor="remember" className="ml-2 text-slate-600 dark:text-slate-400 font-normal cursor-pointer">
                                Ingat saya
                            </Label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            tabIndex={4}
                            disabled={processing}
                            data-test="login-button"
                        >
                            {processing && <Spinner className="mr-2 text-white" />}
                            Masuk
                        </Button>
                    </form>
                    
                    <div className="pt-6 text-center text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800">
                        &copy; {new Date().getFullYear()} SMAN 53 Jakarta. All rights reserved.
                    </div>
                </div>
            </div>
        </div>
    );
}

