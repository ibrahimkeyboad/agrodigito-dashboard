"use client"

import { useState } from "react"
import { MoreHorizontal, Trash, CheckCircle, XCircle, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toggleUserVerification, deleteUser } from "./actions"
import { toast } from "sonner"
import Link from "next/link"

interface UserActionsCellProps {
  userId: string
  isVerified: boolean
}

export function UserActionsCell({ userId, isVerified }: UserActionsCellProps) {
  const [loading, setLoading] = useState(false)

  const handleVerify = async (status: boolean) => {
    setLoading(true)
    try {
      await toggleUserVerification(userId, status)
      toast.success(status ? "User verified successfully" : "User verification revoked")
    } catch {
      toast.error("Failed to update status")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure? This will delete the user, their shop, and all inventory PERMANENTLY.")) return
    
    setLoading(true)
    try {
      await deleteUser(userId)
      toast.success("User deleted")
    } catch {
      toast.error("Failed to delete user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={loading}>
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        
        <Link href={`/dashboard/users/${userId}`}>
          <DropdownMenuItem>
            <Eye className="mr-2 h-4 w-4" /> View Details
          </DropdownMenuItem>
        </Link>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => handleVerify(!isVerified)} 
          disabled={loading}
          className="cursor-pointer"
        >
          {isVerified ? (
            <>
              <XCircle className="mr-2 h-4 w-4 text-orange-600" /> Unverify User
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4 text-green-600" /> Verify User
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleDelete} 
          disabled={loading}
          className="text-red-600 focus:text-red-600 cursor-pointer"
        >
          <Trash className="mr-2 h-4 w-4" /> Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
