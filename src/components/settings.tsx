import Modal from "@/components/custom-ui/modal"
import useSettingsStore from "@/store/settingsStore"
import { IconCheck, IconInfoCircle, IconRefreshDot, IconX } from "@tabler/icons-react";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import useStickerStore from "@/store/stickerStore";
import { useEffect, useState } from "react";
import { Textarea } from "./ui/textarea";
import useTimeStore from "@/store/timeStore";
import useThemeStore, { themes, themeToCss } from "@/store/themeStore";

export default function Settings() {

    const { open, toggle } = useSettingsStore();
    const { stickers, setActiveId } = useStickerStore();

    const [sticker, setSticker] = useState("");

    const {setTime, setTimeStamp, setTicking, setState} = useTimeStore();
    const { activeThemeId, customCss, setActiveThemeId, setCustomCss } = useThemeStore();

    const [ft, setFT] = useState(0);
    const [sb, setSB] = useState(0);
    const [lb, setLB] = useState(0);
    const [selectedTheme, setSelectedTheme] = useState(activeThemeId);
    const [localCustomCss, setLocalCustomCss] = useState(customCss);


    function close() {
        toggle()
    }

    useEffect(() => {
        const curSticker = localStorage.getItem("sticker_pack") ?? "16377";
        setSticker(curSticker);
        setActiveId(curSticker);


        const ft = parseInt(localStorage.getItem("focus_timer") ?? "13");
        const sb = parseInt(localStorage.getItem("short_break") ?? "5");
        const lb = parseInt(localStorage.getItem("long_break") ?? "10")

        setTimeStamp(ft * 1000 * 60 );
        setFT(ft);
        setSB(sb);
        setLB(lb);

        setTime([ft, sb, lb])

    }, [])

    useEffect(() => {
        setSelectedTheme(activeThemeId);
        setLocalCustomCss(customCss);
    }, [open, activeThemeId, customCss]);

    function changeSticker(id: string) {
        setSticker(id)
    }

    function saveChanges() {
        setActiveId(sticker)
        localStorage.setItem("sticker_pack", sticker);

        setTimeStamp(ft * 1000 * 60);
        setTicking(false);
        setState(0);

        localStorage.setItem("focus_timer", ft.toString());
        localStorage.setItem("short_break", sb.toString());
        localStorage.setItem("long_break",  lb.toString());

        setTime([ft, sb, lb])

        setActiveThemeId(selectedTheme);
        setCustomCss(localCustomCss);
        localStorage.setItem("theme_id", selectedTheme);
        localStorage.setItem("theme_custom_css", localCustomCss);

        close()
    }

    function changeFT(time: number){
        if(time < 1) {
            time = 1
        }
        setFT(time)
    }

    function changeSB(time: number){
        if(time < 1) {
            time = 1
        }
        setSB(time)
    }

    function changeLB(time: number){
        if(time < 1) {
            time = 1
        }
        setLB(time)
    }

    return (
        <>
            {open && <Modal title="Setting" close={close}
                headerContent={
                    <div className="flex gap-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="cursor-pointer rounded p-1 theme-btn-hover">
                                        <IconRefreshDot size={18} />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="left" style={{ zIndex: 1000 }}>
                                    <p className="py-1">Reset</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div onClick={close} className="cursor-pointer rounded p-1 theme-btn-hover">
                                        <IconX size={18} />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="left" style={{ zIndex: 1000 }}>
                                    <p className="py-1">Cancel Changes</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="cursor-pointer rounded p-1 theme-btn-hover" onClick={saveChanges}>
                                        <IconCheck size={18} />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="left" style={{ zIndex: 1000 }}>
                                    <p className="py-1">Save Changes</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                }

                bodyContent={
                    <div className="mt-2 px-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <b className="flex gap-2 text-sm mb-1">Timer Sequence:
                                        <IconInfoCircle size={17} className="mt-[1px] cursor-pointer" />
                                    </b>
                                </TooltipTrigger>
                                <TooltipContent side="right" style={{ zIndex: 1000 }}>
                                    <p className="py-1 max-w-[200px]">Uses the <b>Pomodoro sequence:</b> Pomodoro → short break, repeat 4x, then one long break</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <div className="flex justify-between gap-2 w-full">
                            <div className="w-full">
                                <small className="font-semibold">Focus Timer</small>
                                <input type="number" onChange={(event)=>{
                                    changeFT(parseInt(event.target.value));
                                }} defaultValue={ft} id="foucs_timer" className="rounded p-1 w-full mt-1" style={{ backgroundColor: "var(--theme-input-bg)" }} />
                                <small className="">minutes</small>
                            </div>
                            <div className="w-full">
                                <small className="font-semibold">Short Breaks</small>
                                <input type="number" onChange={(event)=>{
                                    changeSB(parseInt(event.target.value));
                                }} defaultValue={sb} id="short_break" className="rounded p-1 w-full mt-1" style={{ backgroundColor: "var(--theme-input-bg)" }} />
                                <small className="">minutes</small>
                            </div>
                            <div className="w-full">
                                <small className="font-semibold">Long Breaks</small>
                                <input type="number" onChange={(event)=>{
                                    changeLB(parseInt(event.target.value));
                                }} defaultValue={lb} id="long_break" className="rounded p-1 w-full mt-1" style={{ backgroundColor: "var(--theme-input-bg)" }} />
                                <small className="">minutes</small>
                            </div>
                        </div>
                        <hr className="mt-2" style={{ borderColor: "var(--theme-muted)" }} />
                        <div className="mt-4 text-sm mb-2 font-semibold">Sticker Pack: </div>
                        <div className="flex h-30">
                            <img src={`/sticker/${sticker}/choose.gif`} className="w-30" alt="" />
                            <div className="w-full p-2" style={{ borderLeft: "1px solid var(--theme-muted)" }}>
                                <div className="text-sm">Choose A Pack:</div>
                                <select onChange={(event) => {
                                    changeSticker(event.target.value)
                                }} value={sticker} className="w-full mt-1 px-1 py-2" style={{ backgroundColor: "var(--theme-input-bg)" }}>
                                    {Object.entries(stickers).map(([key, value]) => (
                                        <option key={key} id={key} value={value.id}>{value.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <hr className="mt-2" style={{ borderColor: "var(--theme-muted)" }} />
                        <div className="mt-4 text-sm mb-2 font-semibold">Theme:</div>
                        <div className="grid grid-cols-4 gap-2">
                            {themes.map((theme) => (
                                <button
                                    key={theme.id}
                                    onClick={() => {
                                        setSelectedTheme(theme.id);
                                        setLocalCustomCss(themeToCss(theme.colors));
                                    }}
                                    className="flex flex-col items-center gap-1 p-1.5 rounded cursor-pointer transition-all"
                                    style={{
                                        border: selectedTheme === theme.id
                                            ? `2px solid ${theme.colors.accent}`
                                            : "2px solid transparent",
                                        backgroundColor: selectedTheme === theme.id
                                            ? "var(--theme-input-bg)"
                                            : "transparent",
                                    }}
                                >
                                    <div className="flex w-full h-5 rounded overflow-hidden" style={{ border: "1px solid var(--theme-muted)" }}>
                                        <div className="flex-1" style={{ backgroundColor: theme.colors.bg }} />
                                        <div className="flex-1" style={{ backgroundColor: theme.colors.card }} />
                                        <div className="flex-1" style={{ backgroundColor: theme.colors.accent }} />
                                    </div>
                                    <span className="text-[10px] leading-tight">{theme.name}</span>
                                </button>
                            ))}
                        </div>
                        <hr className="mt-3" style={{ borderColor: "var(--theme-muted)" }} />
                        <div className="mt-3 text-sm mb-4">
                            <div className="font-semibold mb-2">Custom CSS:</div>
                            <Textarea
                                placeholder="Add custom CSS overrides"
                                className="mt-1 resize-none h-24"
                                style={{ backgroundColor: "var(--theme-input-bg)", color: "var(--theme-text)" }}
                                value={localCustomCss}
                                onChange={(e) => setLocalCustomCss(e.target.value)}
                            />
                        </div>
                    </div>
                }>

            </Modal>}
        </>
    )
}
