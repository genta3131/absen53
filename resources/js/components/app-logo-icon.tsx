import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/Logo_SMAN_53_Jakarta.png"
            alt="Logo SMAN 53 Jakarta"
        />
    );
}
