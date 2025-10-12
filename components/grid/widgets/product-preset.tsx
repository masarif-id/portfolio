import { FaArrowRight, FaCamera } from 'react-icons/fa6';
import Anchor from '../../ui/anchor';
import Card from '../../ui/card';

export default function ProductPreset() {
    return (
        <Card className='relative flex h-full flex-col items-center justify-center'>
            <div className='absolute bottom-3 left-3'>
                <Anchor className='cancel-drag' href='/products/preset'>
                    <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                    <span className='sr-only'>Lightroom Preset</span>
                </Anchor>
            </div>
            <div className='text-center'>
                <FaCamera size='3rem' className='mb-3 mx-auto' />
                <h3 className='font-pixelify-sans text-lg font-bold'>Lightroom</h3>
                <p className='text-sm opacity-90'>Preset</p>
            </div>
        </Card>
    );
}