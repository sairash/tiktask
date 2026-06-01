import useModalStore from "@/store/modalStore";
import {ReactNode, useCallback, useEffect} from "react";



interface ModalProps {
    close: () => void;
    title: string;
    headerContent?: ReactNode; 
    bodyContent: ReactNode; 
}


function modal({close, title, headerContent, bodyContent}: ModalProps) {

    const {setOpen} = useModalStore()

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            close();
        }
    }, [close]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [handleKeyDown]);


    useEffect(()=>{
        setOpen(true);

        return () =>{
            setOpen(false);
        }
    }, [])

    return (
        <>
            <div className="fixed w-full px-2 h-full max-w-md max-h-100   left-1/2 top-1/2" style={{transform: `translate(-50%, -50%)`, zIndex: 1000,}}>
                <div className="px-4 h-full w-full py-2 rounded flex flex-col" style={{ backgroundColor: "var(--theme-card)", color: "var(--theme-text)" }}>
                    <div className="flex justify-between pt-1 pb-2">
                        <b className="">{title}</b>
                        {headerContent}
                    </div>
                    <div className="w-full h-full overflow-y-auto overflow-x-hidden">
                        {bodyContent}
                    </div>
                </div>
            </div>
            <div onClick={close} className="fixed top-0 left-0 w-screen h-screen cursor-pointer" style={{zIndex: 999, backgroundColor: "rgba(0,0,0, 0.5)",}}></div>
        </>
    )
}

export default  modal;