import { FaArrowRight, FaInstagram } from 'react-icons/fa6';
import Anchor from '../../ui/anchor';
import Card from '../../ui/card';

export default function LinkedIn() {
    return (
        <Card className='relative flex h-full flex-col items-center justify-center dark:bg-black' style={{background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',}}>
            <div className='absolute bottom-3 left-3'>
                <Anchor className='cancel-drag' href='https://instagram.com/masarif.id' target='_blank'>
                    <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                    <span className='sr-only'>LinkedIn</span>
                </Anchor>
            </div>
            <FaInstagram size='4rem' color='white' />
        </Card>
    );
}
