import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginationLink[];
    className?: string;
}

export default function Pagination({ links, className }: PaginationProps) {
    if (links.length <= 3) return null;

    return (
        <div className={cn('flex flex-wrap justify-center gap-1', className)}>
            {links.map((link, key) => (
                link.url === null ? (
                    <div
                        key={key}
                        className="px-4 py-2 text-sm text-muted-foreground border rounded-md opacity-50 cursor-not-allowed"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <Link
                        key={key}
                        href={link.url}
                        className={cn(
                            'px-4 py-2 text-sm border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors',
                            link.active ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground'
                        )}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                )
            ))}
        </div>
    );
}
