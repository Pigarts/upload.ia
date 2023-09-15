import { Button } from "./components/ui/button";
import { Github, Wand2 } from "lucide-react" 
import { Separator } from "./components/ui/separator";
import { Textarea } from "./components/ui/textarea";
import { VideoInputForm } from "./components/vide-input-form";
import { useState } from "react";
import { useCompletion } from "ai/react"
import { Label } from "./components/ui/label";
import { PromptSelect } from "./components/prompt-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Slider } from "./components/ui/slider";

export function App() {
  const [temperature, setTemperature] = useState(0.5)
  const [videoId, setVideoId] = useState<string | null>(null)

  const {
    input, setInput, handleInputChange, handleSubmit, completion, isLoading
  } = useCompletion({
    api: "http://localhost:3333/ia/complete",
    body: {
      videoId,
      temperature,
    },
    
    headers: {
      'Content-Type': 'application/json',
    }
    
  })

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-3 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">Upload.ia</h1>
        <div className="flex gap-3 items-center">
          <span className="text-sm text-muted-foreground">Desenvolvido durante a NLW da <a href="https://www.rocketseat.com.br/" target="_blank">Rocketseat</a></span>
          <Separator orientation="vertical" className="h-6"/>
          <Button variant={"default"}><a href="https://github.com/Pigarts/upload.ia" target="_blank" className="flex"><Github className="w-4 h-4 mr-2"/>Github</a> </Button>
        </div>
      </header>
      <main className="flex-1 flex gap-6 p-6 ">
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea className="resize-none p-5 leading-relaxed" placeholder="Inclua o prompt para a IA" value={input} onChange={handleInputChange}/>
            <Textarea className="resize-none p-5 leading-relaxed" placeholder="Resultado gerado pela IA" value={completion} readOnly/>

          </div>
          <p className="text-sm text-muted-foreground">Lembre-se, a variavel <code className="text-violet-400">{"{trascrição}"}</code> representa no seu prompt a trascrição do video.</p>
        </div>
        <aside className="w-80 space-y-6">
         <VideoInputForm onVideoUploaded={setVideoId}/>
          <Separator/>
          <form onSubmit={handleSubmit} className=" space-y-6">
          <div className="space-y-3">
              <Label>Prompt</Label>
              <PromptSelect onPromptSelected={setInput}/>
            </div>

            <Separator/>

            <div className="space-y-3">
              <Label>Modelo</Label>
              <Select defaultValue='gpt3.5' disabled>
                <SelectTrigger>
                  <SelectValue/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>
              <span className="block text-xs italic text-muted-foreground">Voce podera customizar esta opção em breve.</span>
            </div>
            
              <Separator />
            <div className="space-y-4">
              <Label className="space-y-2 " > Temperatura </Label>
              <Slider min={0} max={1} step={0.1} value={[temperature]} onValueChange={value => setTemperature(value[0])}/>
              <span className="text-muted-foreground block text-xs italic"> Valores mais altos geram resultados mais criativos porem com possiveis erros</span>
            </div>
              <Separator/>
              <Button disabled={isLoading} className="flex gap-2 w-full " type="submit">Executar <Wand2 className=" h-4 w-4"/></Button>
          </form>
        </aside>
      </main>
    </div>
  )
}


