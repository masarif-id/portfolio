'use client';

import { useMounted } from '@/utils/hooks';
import { cn } from '@/utils/lib';
import Footer from '@/components/ui/footer';

export default function Template({ children }: Readonly<{ children: React.ReactNode }>) {
    return <Content>{children}</Content>;
}

function Content({ children, className }: Readonly<{ children: React.ReactNode; className?: string }>) {
    const isMounted = useMounted();

    return (
        <div className='min-h-screen flex flex-col'>
            <div
                className={cn(
                    isMounted ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0',
                    'transition-[opacity,_transform] duration-700 flex-1',
                    className
                )}>
                {children}
            </div>
            <Footer />
        </div>
    );
}