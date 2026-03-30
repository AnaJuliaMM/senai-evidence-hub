import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const items = [
    { label: "Iniciação Científica", value: "iniciacao_cientifica" },
    { label: "Projeto de Extensão", value: "projeto_extensão" },
    { label: "Visita Técnica", value: "visita_tecnica" },
    { label: "Palestra/Workshop/Masterclass", value: "palestras" },
    { label: "Visita Técnica", value: "visita_tecnica" },
    { label: "Outro", value: "outro" },
]

export function SelectInput({value,onChange}) {
  return (
    <Select value={value} onValueChange={onChange} required>
      <SelectTrigger className="w-full max-w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Selecione uma categoria</SelectLabel>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
