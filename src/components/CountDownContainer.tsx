import CountDownTimer from "./CountDown";
import useTimeStore from "@/store/timeStore";

const CountDownContainer = () => {

    const {state}= useTimeStore();

    return (
        <div className="min-w-xs ">
            <div className="text-center mb-5 text-4xl">

                {state != 8? state % 2 == 0? "Focus Timer": "Short Break": "Long Break"}
            </div>
            <div className="flex justify-center p-2 w-full h-full school">
                <div className="p-2 text-7xl">
                    <CountDownTimer />
                </div>
            </div>
        </div>
    )
}

export default CountDownContainer