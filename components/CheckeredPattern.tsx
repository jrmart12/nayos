export default function CheckeredPattern({ className = "" }: { className?: string }) {
    return (
        <svg 
            preserveAspectRatio="xMidYMid meet" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0.011 228.48 50.743" 
            className={className}
            role="presentation" 
            aria-hidden="true"
        >
            <g>
                <g>
                    <path fill="#9B292C" d="M152.261 50.754h25.223V25.531h-25.223z"></path>
                    <path fill="#9B292C" d="M126.73 25.234h25.223V.011H126.73z"></path>
                    <path fill="#9B292C" d="M101.507 50.754h25.223V25.531h-25.223z"></path>
                    <path fill="#9B292C" d="M75.976 25.234H101.2V.011H75.976z"></path>
                    <path fill="#9B292C" d="M50.754 50.754h25.223V25.531H50.754z"></path>
                    <path fill="#9B292C" d="M25.233 25.234h25.223V.011H25.233z"></path>
                    <path fill="#9B292C" d="M0 50.754h25.223V25.531H0z"></path>
                    <path fill="#9B292C" d="M203.257 50.754h25.223V25.531h-25.223z"></path>
                    <path fill="#9B292C" d="M177.737 25.234h25.223V.011h-25.223z"></path>
                </g>
            </g>
        </svg>
    );
}
