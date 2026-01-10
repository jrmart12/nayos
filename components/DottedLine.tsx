export default function DottedLine({ className = "" }: { className?: string }) {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className="flex-1 border-t-4 border-dotted border-[#9B292C]" 
                 style={{ borderWidth: '3px', borderStyle: 'dotted' }}>
            </div>
        </div>
    );
}
