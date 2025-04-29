// components/SearchBar.tsx
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function SearchBar({ value, onChange, onSearch }: {
  value: string;
  onChange: (val: string) => void;
  onSearch: () => void;
}) {
  return (
    <div className="flex items-center w-full max-w-md mx-auto gap-2">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search communities..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button variant="default" onClick={onSearch}>Search</Button>
    </div>
  )
}
