import { useSwitchChain } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function NetworkSwitcher() {
  const { switchChain, chains } = useSwitchChain()

  const networks = [
    { chain: base, name: 'Base', icon: '🔷' },
    { chain: baseSepolia, name: 'Base Sepolia', icon: '🧪' },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <span>Network</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {networks.map(({ chain, name, icon }) => (
          <DropdownMenuItem
            key={chain.id}
            onClick={() => switchChain({ chainId: chain.id })}
            className="gap-2"
          >
            <span>{icon}</span>
            <span>{name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}