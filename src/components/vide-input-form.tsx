import { FileVideo, Upload } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { getFfmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { api } from "@/lib/axios";

type Status = `waiting` | `converting` | `uploading` | `generating` | `success`

const statusMessage = {
    converting: `convertendo`,
    uploading: `carregando`,
    generating: `gerando transcrição`,
    success: `tudo pronto`
}

interface VideoInputProps { onVideoUploaded: (id: string) => void}

export function VideoInputForm(prop:VideoInputProps) {
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const [status, setStatus] = useState<Status>("waiting")
    const promptInputRef = useRef<HTMLTextAreaElement>(null)    

    function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
        const {files} = event.currentTarget
        if(!files) {return}
        const selectedFiles = files[0]
        setVideoFile(selectedFiles)
    }
    
    
    async function convertVideoToAudio(video: File) {
        console.log("convert processes started")
        const ffmpeg = await getFfmpeg()
        await ffmpeg.writeFile("input.mp4", await fetchFile(video))
        ffmpeg.on("progress", progress => {
            console.log`convert progress ${Math.round(progress.progress * 100)}`
        })
        await ffmpeg.exec([`-i`,`input.mp4`,`-map`,`0:a`,`-b:a`,`20k`,`-acodec`,`libmp3lame`,`output.mp3`])
        const data = await ffmpeg.readFile(`output.mp3`)
        const audioFileBlob = new Blob([data], { type: `audio/mpeg` })
        const audioFile = new File([audioFileBlob], `audio.mp3`, {type: `audio/mpeg`})
        console.log("convert processes finished")
        return audioFile
    }
     async function handleUpload(event:FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const prompt = promptInputRef.current?.value
        if(!videoFile) {return}
        setStatus("converting")
        const audioFile = await convertVideoToAudio(videoFile)
        const data = new FormData()
        data.append(`file`, audioFile)
        setStatus("uploading")
        const response = await api.post(`/videoupload`, data)
        const videoId = response.data.video.id
        setStatus("generating")
        await api.post(`/videoupload/${videoId}/transcription`, {prompt,})
        setStatus("success")
        console.log("transcrição pronta")
        prop.onVideoUploaded(videoId)
    }
    
    const previewURL = useMemo(() => {
        if(!videoFile) {return null}
        return URL.createObjectURL(videoFile)
    }, [videoFile]) 
    
    return (
        <form onSubmit={handleUpload} action="" className="space-y-6">
            <label htmlFor="video" className="relative flex border rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5">
          
          {
          previewURL ? <video src={previewURL} controls={false} className="absolute inset-0 pointer-events-none"></video> : (
            <>
                <FileVideo className="w-4 h-4"/>
                Selecione um video
            </>
            )
          }
            </label>
        <input type="file" id="video" accept="video/mp4" className="sr-only " onChange={handleFileSelect} />
        <Separator className=""/>
        <div className="space-y-1">
          <Label htmlFor="transcription_Prompt">Prompt de transcrição </Label>
          <Textarea disabled={status !== "waiting"} ref={promptInputRef} id="transcription_Prompt" className="min-h-20 leading-relaxed" placeholder="Inclua palavras-chave ditas no video separadas por (,)"/>
        </div>
        <Button data-success={status == "success"} disabled={status !== "waiting"} type="submit" className="data-[success=true]:bg-emerald-400 w-full flex items-center gap-2">
         {
         status == "waiting" ? (
                <>
                Carrecar video <Upload className=" h-4 w-4"/>
                </>
            )
            : statusMessage[status] 

         }
          
        </Button>
      </form>
    )
}