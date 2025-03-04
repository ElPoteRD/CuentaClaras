import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Transaction {
  avatar: string
  initials: string
  name: string
  description: string
  amount: string
}

const transactions: Transaction[] = [
 
]

export function TransacionReciente() {
  return (
    <div className="space-y-8">
      {transactions.map((transaction, index) => (
        <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={transaction.avatar} alt="Avatar" />
            <AvatarFallback>{transaction.initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <p className="text-sm font-medium leading-none">{transaction.name}</p>
            <p className="text-sm text-muted-foreground">{transaction.description}</p>
          </div>
          <div className="font-medium">{transaction.amount}</div>
        </div>
      ))}
    </div>
  )
}

