import { JSX, memo, useCallback, useEffect } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import {
    IconMusic,
    IconPictureInPictureOff,
    IconPictureInPictureOn,
    IconPlayerPause, IconPlayerPlay, IconSettings
} from "@tabler/icons-react";
import useModalStore from "@/store/modalStore";


const ControlButtons = ({ btnEvent, activeButtons }: { btnEvent: (data: string, close: boolean) => void, activeButtons: string[] }) => {
    const {open} = useModalStore();

    const obj_button: Record<string, JSX.Element> = {
        "play": <TooltipProvider key="play">
            <Tooltip>
                <TooltipTrigger>
                    <div className="w-10 h-10 p-1.5 rounded cursor-pointer theme-btn-hover" onClick={() => {
                        btnEvent("play", false)
                    }}>
                        <IconPlayerPlay width={30} height={30} stroke={2} />
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="py-1">Play <span className="px-2 rounded py-0.5 ml-1 bg-gradient-to-r from-gray-500 to-gray-600">Space</span></p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>,
        "pause": <TooltipProvider key="pause">
            <Tooltip>
                <TooltipTrigger>
                    <div className="w-10 h-10 p-1.5 rounded cursor-pointer theme-btn-hover" onClick={() => {
                        btnEvent("play", false)
                    }}>
                        <IconPlayerPause width={30} height={30} stroke={2} />
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="py-1">Pause <span className="px-2 rounded py-0.5 ml-1 bg-gradient-to-r from-gray-500 to-gray-600">Space</span></p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>,
        "music": <TooltipProvider key="music">
            <Tooltip>
                <TooltipTrigger>
                    <div className="w-10 h-10 p-1.5 rounded cursor-pointer theme-btn-hover" onClick={() => {
                        btnEvent("music", false)
                    }}>
                        <IconMusic width={30} height={30} stroke={2} />
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="py-1">Music <span className="px-2 rounded py-0.5 ml-1 bg-gradient-to-r from-gray-500 to-gray-600">M</span></p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>,

        "settings": <TooltipProvider key="settings">
            <Tooltip>
                <TooltipTrigger>
                    <div className="w-10 h-10 p-1.5 rounded cursor-pointer theme-btn-hover" onClick={() => {
                        btnEvent("settings", false)
                    }}>
                        <IconSettings width={30} height={30} stroke={2} />
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="py-1">Settings <span className="px-2 rounded py-0.5 ml-1 bg-gradient-to-r from-gray-500 to-gray-600">S</span></p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>,

        "picture-in-picture": <TooltipProvider key="picture-in-picture">
            <Tooltip>
                <TooltipTrigger>
                    <div className="w-10 h-10 rounded cursor-pointer p-1.5 theme-btn-hover" onClick={() => {
                        btnEvent("pip", false)
                    }}>
                        <IconPictureInPictureOn width={30} height={30} stroke={2} />
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="py-1">Pop Out <span className="px-2 rounded py-0.5 ml-1 bg-gradient-to-r from-gray-500 to-gray-600">P</span></p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>,
        "picture-in-picture-open": <TooltipProvider key="picture-in-picture-open">
            <Tooltip>
                <TooltipTrigger>
                    <div className="w-10 h-10 rounded cursor-pointer p-1.5 theme-btn-hover" onClick={() => {
                        btnEvent("pip", true)
                    }}>
                        <IconPictureInPictureOff width={30} height={30} stroke={2} />
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="py-1">Pop In <span className="px-2 rounded py-0.5 ml-1 bg-gradient-to-r from-gray-500 to-gray-600">P</span></p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    }


    const handleKeyDown = useCallback((ev: KeyboardEvent) => {
        if(open){
            return
        }
        switch (ev.code) {
            case "Space":
                btnEvent("play", true);
                break;
            case "KeyM":
                btnEvent("music", false);
                break;
            case "KeyP":
                btnEvent("pip", false);
                break;
            case "KeyS":
                btnEvent("settings", false);
                break;
            case "KeyT":
                btnEvent("task", false);
                break;
            default:
                break;
        }
    }, [btnEvent,open]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [handleKeyDown]);


    return (
        <>
            <div className="fixed bottom-16 left-[50%]" style={{ transform: `translateX(-50%)` }}>
                <div className="flex justify-center gap-1">
                    {activeButtons.map((buttonType) => (
                        obj_button[buttonType]
                    ))}
                </div>
            </div>
        </>
    )
};

export default memo(ControlButtons);