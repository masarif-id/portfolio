import { IconType } from 'react-icons';
import { FaGithub, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa6';

interface Social {
    name: string;
    url: string;
    icon: IconType;
}

const socials: Social[] = [
    {
        name: 'Instagram',
        url: 'https://instagram.com/masarif.id',
        icon: FaInstagram,
    },
    {
        name: 'Github',
        url: 'https://github.com/masarif-id',
        icon: FaGithub,
    },
    {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/homearif6',
        icon: FaLinkedin,
    },
    {
        name: 'YouTube',
        url: 'https://www.youtube.com/@masarifid',
        icon: FaYoutube,
    },
];

export default socials;
