import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Order } from "@/types"

interface RecentSalesProps {
  recentOrders: Order[]
}

export function RecentSales({ recentOrders }: RecentSalesProps) {
  // If no orders yet, show empty state or fallback
  if (!recentOrders || recentOrders.length === 0) {
      return <div className="text-sm text-muted-foreground">No recent sales.</div>
  }

  return (
    <div className="space-y-8">
      {recentOrders.map((order) => {
        const name = order.customerInfo?.customerName || "Unknown Customer"
        const phone = order.customerInfo?.customerPhone || "No Phone"
        const amount = order.total || 0
        
        // Generate initials
        const initials = name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2)

        return (
          <div key={order.id} className="flex items-center">
            <Avatar className="h-9 w-9">
              {/* <AvatarImage src="/avatars/01.png" alt="Avatar" /> */}
              <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{name}</p>
              <p className="text-xs text-muted-foreground break-all line-clamp-1">
                {phone}
              </p>
            </div>
            <div className="ml-auto font-medium">
                +TZS {amount.toLocaleString()}
            </div>
          </div>
        )
      })}
    </div>
  )
}
