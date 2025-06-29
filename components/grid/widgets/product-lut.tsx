import { FaArrowRight, FaVideo } from 'react-icons/fa6';
import Anchor from '../../ui/anchor';
import Card from '../../ui/card';

export default function ProductLut() {
    return (
        <Card className='relative flex h-full flex-col items-center justify-center' style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
            <div className='absolute bottom-3 left-3'>
                <Anchor className='cancel-drag' href='https://store.masarif.id/lut' target='_blank'>
                    <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                    <span className='sr-only'>LUTs Video</span>
                </Anchor>
            </div>
            <div className='text-center text-white'>
                <FaVideo size='3rem' className='mb-3 mx-auto' />
                <h3 className='font-pixelify-sans text-lg font-bold'>Video</h3>
                <p className='text-sm opacity-90'>LUTs</p>
            </div>
        </Card>
    );
}