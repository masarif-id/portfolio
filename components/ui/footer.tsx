import { cn } from '@/utils/lib';
import { FaHeart, FaGithub } from 'react-icons/fa6';

interface FooterProps {
    className?: string;
}

export default function Footer({ className }: FooterProps) {
    return (
        <footer className={cn('py-8 text-center text-sm text-gray-600 dark:text-gray-400', className)}>
            <div className='flex flex-col items-center gap-2'>
                <p className='flex items-center gap-1'>
                    Made with <FaHeart className='text-red-500' size='0.875rem' /> by Arif
                </p>
                <p className='flex items-center gap-2'>
                    Based on{' '}
                    <a
                        href='https://github.com/bymaul/portfolio'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center gap-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors'>
                        <FaGithub size='0.875rem' />
                        bymaul/portfolio
                    </a>
                </p>
            </div>
        </footer>
    );
}