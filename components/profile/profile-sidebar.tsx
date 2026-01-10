"use client"

import { cn } from "@/lib/utils"
import {
    User,
    ShoppingBag,
    Star,
    Tag,
    Gift,
    Wallet,
    HelpCircle,
    LogOut,
    Trash2,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteAccount } from "@/lib/account-api"
import { toast } from "sonner"

interface ProfileSidebarProps {
    activeSection: string
    onSectionChange: (section: string) => void
}

export function ProfileSidebar({ activeSection, onSectionChange }: ProfileSidebarProps) {
    const { logout } = useAuth()

    const menuItems = [
        { id: "profile", label: "Profile", icon: User },
        { id: "orders", label: "Order History", icon: ShoppingBag },
        { id: "reviews", label: "My Reviews", icon: Star },
        { id: "offers", label: "Personal Offers", icon: Tag },
        { id: "bonuses", label: "Discounts and Bonuses", icon: Gift },
        { id: "wallet", label: "My Wallet", icon: Wallet },
        { id: "support", label: "Help or Complaint", icon: HelpCircle },
    ]

    const handleDeleteAccount = async () => {
        const success = await deleteAccount()
        if (success) {
            toast.success("Account deleted successfully")
            logout()
        } else {
            toast.error("Failed to delete account")
        }
    }

    return (
        <div className="flex flex-col gap-2 w-full max-w-[280px]">
            <div className="flex flex-col gap-1">
                {menuItems.map((item) => {
                    const Icon = item.icon
                    return (
                        <button
                            key={item.id}
                            onClick={() => onSectionChange(item.id)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium w-full text-left",
                                activeSection === item.id
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "hover:bg-accent text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {item.label}
                        </button>
                    )
                })}
            </div>

            <div className="mt-6 pt-6 border-t border-border flex flex-col gap-1">
                <button
                    onClick={() => logout()}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all w-full text-left"
                >
                    <LogOut className="h-4 w-4" />
                    Log out
                </button>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-all w-full text-left">
                            <Trash2 className="h-4 w-4" />
                            Delete Account
                        </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDeleteAccount}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Delete Account
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}
