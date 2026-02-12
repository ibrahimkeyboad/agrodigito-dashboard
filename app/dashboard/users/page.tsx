import Link from "next/link"
import { getUsers } from "./actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle } from "lucide-react"
import { UserActionsCell } from "./user-actions-cell"

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        <div className="flex gap-2">
            <Badge variant="outline" className="text-sm px-3 py-1">
                Total: {users.length}
            </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Farmers & Shop Owners</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Shop Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  {/* Full Name */}
                  <TableCell className="font-medium">
                    {user.full_name || "N/A"}
                  </TableCell>

                  {/* Email */}
                  <TableCell>
                    {user.shop_name || "N/A"}
                  </TableCell>

                  {/* Phone */}
                  <TableCell> 
                    {user.phone || "N/A"}
                  </TableCell>

                  {/* Role */}
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {user.role || "User"}
                    </Badge>
                  </TableCell>

                  {/* Verified Status */}
                  <TableCell>
                    {user.verified ? (
                       <div className="flex items-center gap-1 text-green-700 bg-green-50 w-fit px-2 py-1 rounded-full text-xs font-medium border border-green-200">
                         <CheckCircle2 className="h-3 w-3" /> Verified
                       </div>
                    ) : (
                       <div className="flex items-center gap-1 text-slate-500 bg-slate-100 w-fit px-2 py-1 rounded-full text-xs font-medium border border-slate-200">
                         <XCircle className="h-3 w-3" /> Unverified
                       </div>
                    )}
                  </TableCell>

                  {/* Actions Dropdown */}
                  <TableCell className="text-right">
                    <UserActionsCell userId={user.id} isVerified={!!user.verified} />
                  </TableCell>
                </TableRow>
              ))}

              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}