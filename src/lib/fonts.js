import {
    Barlow,
    Dancing_Script,
    Faculty_Glyphic,
    Inter,
    Kanit,
    Lato,
    Montserrat,
    Parkinsans,
    Poppins,
    Raleway,
    Roboto_Condensed,
    Roboto,
    Space_Grotesk,
    Marcellus
} from 'next/font/google';

export const barlow = Barlow({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-barlow',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    style: ['normal', 'italic'],
});

export const dancingScript = Dancing_Script({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-dancing-script',
    weight: ['400', '500', '600', '700'],
});

export const marcellus = Marcellus({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-Marcellus',
    weight: '400',
});

export const facultyGlyphic = Faculty_Glyphic({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-faculty-glyphic',
    weight: '400', // <--- THIS IS THE FIX: Specify only the available weight
});

export const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const kanit = Kanit({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-kanit',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    style: ['normal', 'italic'],
});

export const lato = Lato({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-lato',
    weight: ['100', '300', '400', '700', '900'],
    style: ['normal', 'italic'],
});

export const montserrat = Montserrat({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-montserrat',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    style: ['normal', 'italic'],
});

export const parkinsans = Parkinsans({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-parkinsans',
    weight: ['300', '400', '500', '600', '700', '800'],
});

export const poppins = Poppins({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-poppins',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    style: ['normal', 'italic'],
});

export const raleway = Raleway({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-raleway',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    style: ['normal', 'italic'],
});

export const robotoCondensed = Roboto_Condensed({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-roboto-condensed',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    style: ['normal', 'italic'],
});

export const roboto = Roboto({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-roboto',
    weight: ['100', '300', '400', '500', '700', '900'],
    style: ['normal', 'italic'],
});

export const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-space-grotesk',
});