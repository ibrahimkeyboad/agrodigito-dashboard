"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import {
  UserProfile,
  InventoryItem,
  SalesTransaction,
  Shop
} from "@/types/core.types"
import { Order } from "@/types"

// 1. Fetch all users (profiles)
export async function getUsers(): Promise<UserProfile[]> {
  const supabase = await createClient()

  const { data: profiles, error } = await supabase
    .from("profile")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100)

  if (error) {
    console.error("Error fetching users:", error)
    return []
  }

  return profiles as UserProfile[]
}

// 2. Fetch a single user by ID
export async function getUserById(uid: string): Promise<UserProfile | null> {
  const supabase = await createClient()

  const { data: user, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", uid)
    .single()

  if (error || !user) {
    return null
  }

  return user as UserProfile
}

// 3. Toggle Verification Status
export async function toggleUserVerification(userId: string, isVerified: boolean) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("profile")
    .update({ verified: isVerified })
    .eq("id", userId)

  if (error) {
    console.error("Error updating verification:", error)
    throw new Error("Failed to update verification status")
  }

  revalidatePath("/dashboard/users")
  revalidatePath(`/dashboard/users/${userId}`)
}

// 4. Delete User (Hard Delete)
export async function deleteUser(userId: string) {
  const supabase = await createClient()

  // Note: Due to 'ON DELETE CASCADE' in your SQL schema, 
  // deleting the profile will automatically remove their Shop and Inventory.
  const { error } = await supabase
    .from("profile")
    .delete()
    .eq("id", userId)

  if (error) {
    console.error("Error deleting user:", error)
    throw new Error("Failed to delete user")
  }

  revalidatePath("/dashboard/users")
  return { success: true }
}

// 5. Fetch Inventory (Linked via Shop)
export async function getUserInventory(userId: string): Promise<InventoryItem[]> {
  const supabase = await createClient()

  // Step 1: Find the shop owned by this user
  const { data: shop } = await supabase
    .from("agrovet_shops")
    .select("id")
    .eq("owner_id", userId)
    .single()

  if (!shop) return []

  // Step 2: Fetch inventory for that shop
  const { data: inventory, error } = await supabase
    .from("inventory")
    .select(`
      *,
      product:products(
        id, 
        name, 
        category, 
        img
      )
    `)
    .eq("shop_id", shop.id)
    .order("current_stock", { ascending: true })

  if (error) {
    console.error("Inventory fetch error:", error)
    return []
  }

  return inventory as InventoryItem[]
}

// 6. Fetch Sales (Linked via Shop)
export async function getUserSales(userId: string): Promise<SalesTransaction[]> {
  const supabase = await createClient()

  const { data: shop } = await supabase
    .from("agrovet_shops")
    .select("id")
    .eq("owner_id", userId)
    .single()

  if (!shop) return []

  const { data: sales, error } = await supabase
    .from("sales_transactions")
    .select("*")
    .eq("shop_id", shop.id)
    .order("sale_date", { ascending: false })
    .limit(50)

  if (error) {
    console.error("Sales fetch error:", error)
    return []
  }

  return sales as SalesTransaction[]
}

// 7. Get Shop Details
export async function getUserShop(userId: string): Promise<Shop | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("agrovet_shops")
    .select("*")
    .eq("owner_id", userId)
    .single()

  if (error) return null
  return data as Shop
}

// 8. Fetch User Orders (What they bought)
export async function getUserOrders(userId: string): Promise<Order[]> {
  const supabase = await createClient()

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user orders:", error)
    return []
  }

  return (orders || []).map((order: any) => ({
    id: order.id,
    orderNumber: order.order_number || order.id.substring(0, 8).toUpperCase(),
    customerInfo: order.customer_info,
    status: order.status,
    items: order.items || [],
    subtotal: order.subtotal || 0,
    shippingCost: order.shipping_cost || 0,
    total: order.total || 0,
    shippingAddress: order.shipping_address,
    paymentMethod: order.payment_method,
    shippingMethod: order.shipping_method,
    createdAt: order.created_at,
    updatedAt: order.updated_at || order.created_at,
    userId: order.user_id
  })) as Order[]
}