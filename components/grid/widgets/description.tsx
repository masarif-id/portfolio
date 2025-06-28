import profile from '@/public/images/profile.jpg';
import Image from 'next/image';
import Card from '../../ui/card';
import { siteConfig } from '@/config/site';

export default function Description() {
    return (
        <Card className='flex flex-col justify-center gap-4 p-8'>
            <div className='relative size-14 overflow-hidden rounded-full sm:size-16'>
                <Image
                    src={profile}
                    alt={siteConfig.title}
                    fill
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    placeholder='blur'
                    priority
                />
            </div>
            <p className='leading-relaxed'>
                Hi, I&apos;m <span className='font-pixelify-sans text-xl'>Arif</span>, Photographer based in
                Central Java, Indonesia.{' '}
                <span className='hidden md:inline'>His passion for creating visuals runs deep, and each day he finds himself falling more in love with it.</span>
            </p>
        </Card>
    );
}
