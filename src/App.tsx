import { Button } from "./components/ui/button";
import { Github, FileVideo, Upload, Wand2 } from "lucide-react" 
import { Separator } from "./components/ui/separator";
import { Textarea } from "./components/ui/textarea";
import { Label } from "./components/ui/label";
import { Select, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { SelectContent } from "@radix-ui/react-select";
import { Slider } from "./components/ui/slider";


export function App() {

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-3 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">Upload.ia</h1>
        <div className="flex gap-3 items-center">
          <span className="text-sm text-muted-foreground">Desenvolvido durante a NLW da <a href="https://www.rocketseat.com.br/" target="_blank">Rocketseat</a></span>
          <Separator orientation="vertical" className="h-6"/>
          <Button variant={"outline"}><Github className="w-4 h-4 mr-2"/> Github</Button>
        </div>
      </header>
      <main className="flex-1 flex gap-6 p-6 ">
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea className="resize-none p-5 leading-relaxed" placeholder="Inclua o prompt para a IA"/>
            <Textarea className="resize-none p-5 leading-relaxed" placeholder="Resultado gerado pela IA" readOnly/>

          </div>
          <p className="text-sm text-muted-foreground">Lembre-se, você pode usar a variavel <code className="text-violet-400">{"{trascrição}"}</code> no seu prompt para adicionar a trascrição do video.</p>
        </div>
        <aside className="w-80 space-y-6">
          <form action="" className="space-y-6">
            <label htmlFor="video" className=" flex border rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5">
               <FileVideo className="w-4 h-4"/>
               Selecione um video
            </label>
            <input type="file" id="video" accept="video/mp4" className="sr-only " />
            <Separator className=""/>
            <div className="space-y-1">
              <Label htmlFor="transcription_Prompt">Prompt de transcrição </Label>
              <Textarea id="transcription_Prompt" className="min-h-20 leading-relaxed" placeholder="Inclua palavras-chave ditas no video separadas por (,)"/>
            </div>
            <Button type="submit" className="w-full flex items-center gap-2">
              Carrecar video <Upload className=" h-4 w-4"/>
            </Button>
          </form>
          <Separator/>
          <form action="" className=" space-y-6">
          <div className="space-y-3">
              <Label>Prompt</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleciome um prompt"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Titulo para o Youtube</SelectItem>
                  <SelectItem value="description">Descrição para o video</SelectItem>
                </SelectContent>
              </Select>
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
              <Slider min={0} max={1} step={0.1}/>
              <span className="text-muted-foreground block text-xs italic"> Valores mais altos geram resultados mais criativos porem com possiveis erros</span>
            </div>
              <Separator/>
              <Button className="flex gap-2 w-full " type="submit">Executar <Wand2 className=" h-4 w-4"/></Button>
          </form>
        </aside>
      </main>
    </div>
  )
}


