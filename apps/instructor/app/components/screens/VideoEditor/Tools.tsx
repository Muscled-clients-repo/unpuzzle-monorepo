import { useEffect } from "react";



export default function Tools({setScale, currentScale, minScale}:{setScale:any, currentScale:number, minScale:number}) {

    const handleZoom =(e:any)=>{
        const newValue = parseFloat(e.target.value)
        if(newValue>=0.1 && newValue<=60){
            setScale(newValue)
        }
    }

    useEffect(() => {
        // If minScale is greater than currentScale, update it
        if (currentScale < minScale) {
          setScale(minScale);
        }
      }, [minScale]);
    
    return (
        
        <div className="flex items-center justify-between relative  mb-2 gap-20">
            <div className="flex grow-1 items-center justify gap-1  px-[6px] py-1 cursor-pointer flex-grow justify-start h-fit"></div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-4 border border-[#E9E9EA] px-2 py-1 rounded-[5px]">
                  <label><p>Zoom: -{currentScale.toFixed(1)}X </p>
                    <input type="range" id="scaleSlider" min={`${minScale}`} max="60" step="0.2" value={currentScale.toFixed(1)} onChange={handleZoom} />
                  </label>
                </div>
            </div>
        </div>
    );
}
