import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import studentsRoutes from '@/routes/students';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, ClipboardCheck, FileText, Folder, LayoutGrid, Users } from 'lucide-react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { auth } = usePage<any>().props;
    const userRole = auth?.user?.role;

    // Build menu items dynamically based on user role
    const mainNavItems: NavItem[] = [
        // Dashboard - semua role bisa akses
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        // Data Siswa - hanya staf_tu dan guru_piket
        ...(userRole === 'staf_tu' || userRole === 'guru_piket' ? [{
            title: 'Data Siswa',
            href: studentsRoutes.index(),
            icon: Users,
        }] : []),
        // Input Presensi - hanya staf_tu dan guru_piket
        ...(userRole === 'staf_tu' || userRole === 'guru_piket' ? [{
            title: 'Input Presensi',
            href: '/attendance/input',
            icon: ClipboardCheck,
        }] : []),
        // Laporan Harian - staf_tu, kepsek, guru_mapel
        ...(['staf_tu', 'kepsek', 'guru_mapel'].includes(userRole) ? [{
            title: 'Laporan Harian',
            href: '/reports',
            icon: FileText,
        }] : []),
        // Kelola Akun - hanya staf_tu
        ...(userRole === 'staf_tu' ? [{
            title: 'Kelola Akun',
            href: '/users',
            icon: Users,
        }] : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
