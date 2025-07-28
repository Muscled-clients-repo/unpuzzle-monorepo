import { useRef, useState, useEffect, DragEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/Tabs";
import { FileWithMetadata, VideoDurations } from '../../../types/videoeditor.types'
import { RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  startCountdown,
  decrementCountdown,
} from "../../../redux/features/recording/recordingSlice";
// import "../../../../components/style/style.css"; // Path doesn't exist
import LoadingSpinner from '@/components/common/Loading'
import useApi from "../../../hooks/useApi"


export default function MediaLibrary({cb}:{cb:void}) {
    const [selectedFiles, setSelectedFiles] = useState<FileWithMetadata[]>([]);
    const [mediaFiles, setMediaFiles] = useState<FileWithMetadata[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [loading, setLoading] = useState(false)

    const router = useRouter();

    const handleDragStart = (event:any, jsonData:any) => {

      event.dataTransfer.setData("application/json", JSON.stringify(jsonData));
    };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const renderFiles = (files: FileWithMetadata[]) =>
    files.length > 0 ? (
      <div className="flex flex-wrap justify-between max-h-[552px] overflow-y-auto pretty-scrollbar">
        {files.map((file, index) => (
          <div
            key={index}
            className="relative w-[47%] h-max rounded-[4px] overflow-hidden"
            draggable
            onDragStart={(e)=>handleDragStart(e, {id: file.id, url: file.url, duration: file.duration})}
          >
            {file.thumbnail && <img
                src={file.thumbnail}
                alt={file.title}
                className="max-w-full w-full h-[98px] object-cover rounded-[4px]"
                crossOrigin="anonymous"
              />}
            
            <div className="mt-1 text-xs py-[2px] truncate whitespace-nowrap overflow-hidden text-ellipsis text-[10px] font-normal leading-3 text-center break-all">
              {file.name}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-center text-sm text-gray-500">No files found</p>
    );

    // Getting media data effects
    useEffect(()=>{
      const getMedia = async()=>{
        setLoading(true)
        const api = useApi()
        try{
          const response = await api.get("/api/videos")
          if(response.data){
            setMediaFiles(response.data)
          }
        }catch(error){
          console.log(error)
        }finally{
          setLoading(false)
        }
      }

      getMedia()
    },[searchTerm])

  return (
    <div
      className={`bg-white pt-[24px] pb-[30px] rounded-[16px] h-full w-full px-5`}
    >
      {/* Search Input */}
      <div className="mb-[10px] h-[35px] w-full flex flex-row items-center justify-start p-[10px] gap-4 ring-[1px] ring-[#D9D9D9]">
        <img src="/assets/SearchIcon.svg" alt="Search" />
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-[#F5F4F6] h-full rounded-[6px] text-sm font-medium text-[#5F6165] placeholder-[#A0A3A9] focus:outline-none bg-white"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {loading ? <div className=' h-fit'> <LoadingSpinner /> </div> : renderFiles(mediaFiles)}

    </div>
    );
}
