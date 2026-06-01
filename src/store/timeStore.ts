import {create} from "zustand";

interface timeStamp {
    time: number[];
    state: number;
    timeStamp: number;
    ticking: boolean;
    setTimeStamp: (timeStamp: number)=>void;
    toggleTicking: () => void;
    setTicking: (ticking: boolean) => void;
    setTime: (time: number[]) => void;
    setState: (state: number) => void;
    changeState: () => void;
}

const useTimeStore = create<timeStamp>((set, get) =>({
    time: [0, 0, 0],
    state: 0,
    timeStamp: 0,
    ticking: false,
    setTimeStamp: (timeStamp)=> set(()=>({
        timeStamp: timeStamp
    })),
    toggleTicking: () => set((state)=>({
        ticking: !state.ticking,
    })),
    setTicking: ((ticking: boolean) => set(() => ({
        ticking: ticking,
    }))),
    setTime: ((time: number[]) => set(() =>({
        time: time
    }))),
    setState: (s) => set(() => ({ state: s })),
    changeState: () => set((state) => {
        const nextState = state.state === 8 ? 0 : state.state + 1;
        const nextTimeIndex = nextState === 8 ? 2 : nextState % 2;
        return {
            state: nextState,
            timeStamp: state.time[nextTimeIndex] * 60 * 1000,
        };
    })
}))

export default useTimeStore;