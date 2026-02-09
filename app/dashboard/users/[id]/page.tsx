import { notFound } from "next/navigation"
import { getUserById, getUserInventory, getUserOrders } from "../actions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MapPin, CheckCircle2, ShieldAlert } from "lucide-react"
import { InventoryItem } from "@/types/core.types"

export default async function UserDetailsPage({ params }: { params: { id: string } }) {
  const { id } = await params
  
  // Fetch user data
  const user = await getUserById(id)
  if (!user) notFound()

  // CHECK ROLE: Is this an Agrovet Owner?
  // We check if the role string contains "owner" or "agrovet" just to be safe with casing
  const isAgrovetOwner = user.role?.toLowerCase().includes("owner") || user.role?.toLowerCase().includes("agrovet")
  
  // Fetch data in parallel
  const [inventory, orders] = await Promise.all([
    isAgrovetOwner ? getUserInventory(id) : Promise.resolve([]),
    getUserOrders(id)
  ])

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 bg-slate-50 min-h-screen">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row items-start gap-6 mb-6 bg-white p-6 rounded-lg shadow-sm border">
        <Avatar className="h-24 w-24 border-4 border-slate-50">
          <AvatarImage src={user.image || ""} />
          <AvatarFallback className="text-3xl bg-slate-200 text-slate-500">
             {user.full_name?.substring(0, 1) || "U"}
          </AvatarFallback>
        </Avatar>
        
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">{user.full_name || "Unknown Name"}</h2>
            {user.verified ? (
                <Badge className="bg-green-600 hover:bg-green-700 flex gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Verified Account
                </Badge>
            ) : (
                <Badge variant="destructive" className="flex gap-1">
                    <ShieldAlert className="h-3 w-3" /> Unverified
                </Badge>
            )}
          </div>
          
          <div className="flex gap-2">
             <Badge variant="outline" className="capitalize px-3 py-1 text-sm bg-slate-100">
                {user.role || "User"}
             </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-slate-600 mt-4">
            <div className="flex items-center"><Phone className="mr-2 h-4 w-4 opacity-70"/> {user.phone || "No Phone"}</div>
            <div className="flex items-center"><Mail className="mr-2 h-4 w-4 opacity-70"/> {user.email || "No Email"}</div>
            <div className="flex items-center col-span-2">
                <MapPin className="mr-2 h-4 w-4 opacity-70"/> 
                {user.region ? `${user.region}, ${user.district}, ${user.ward}` : "No Location Data"}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Tabs Section */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile Details</TabsTrigger>
          <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
          
          {/* CONDITIONAL RENDER: Only show Inventory Tab if Agrovet Owner */}
          {isAgrovetOwner && (
            <TabsTrigger value="inventory">Shop Inventory ({inventory.length})</TabsTrigger>
          )}
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader><CardTitle>Full Information</CardTitle></CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
               <div className="space-y-1">
                 <h4 className="text-sm font-medium text-slate-500">Full Name</h4>
                 <p className="text-base font-medium">{user.full_name}</p>
               </div>
               <div className="space-y-1">
                 <h4 className="text-sm font-medium text-slate-500">User Role</h4>
                 <p className="text-base capitalize">{user.role}</p>
               </div>
               <div className="space-y-1">
                 <h4 className="text-sm font-medium text-slate-500">Registration Date</h4>
                 <p className="text-base">{new Date(user.created_at).toLocaleDateString()}</p>
               </div>
               <div className="space-y-1">
                 <h4 className="text-sm font-medium text-slate-500">Database ID</h4>
                 <p className="text-xs font-mono bg-slate-100 p-1 rounded w-fit">{user.id}</p>
               </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
             <CardHeader>
                 <CardTitle>Order History</CardTitle>
                 <CardDescription>Orders placed by this user</CardDescription>
             </CardHeader>
             <CardContent>
                {orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 last:border-0 gap-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-slate-900">Order #{order.orderNumber}</p>
                                        <Badge variant="outline" className={
                                            order.status === 'delivered' ? 'text-green-600 border-green-200 bg-green-50' :
                                            order.status === 'cancelled' ? 'text-red-600 border-red-200 bg-red-50' :
                                            'text-blue-600 border-blue-200 bg-blue-50'
                                        }>
                                            {order.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-slate-500">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-900">
                                        TJS {order.total.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {order.items.length} items
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-slate-500">No orders found for this user.</div>
                )}
             </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Tab (Only renders content if user is owner) */}
        {isAgrovetOwner && (
          <TabsContent value="inventory">
            <Card>
                <CardHeader>
                    <CardTitle>Inventory List</CardTitle>
                    <CardDescription>Stock managed by this user</CardDescription>
                </CardHeader>
                <CardContent>
                    {inventory.length > 0 ? (
                        <div className="space-y-4">
                            {inventory.map((item: InventoryItem) => (
                                <div key={item.id} className="flex justify-between border-b pb-2">
                                    <div>
                                        <p className="font-medium">{item.product?.name || "Item"}</p>
                                        <p className="text-sm text-slate-500">Size: {item.size}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">{item.current_stock} in stock</p>
                                        <p className="text-xs text-slate-400">Reorder at: {item.reorder_level}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-500">No inventory found for this shop owner.</div>
                    )}
                </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}