"use client"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pencil } from "lucide-react"
import type { AccountProfile } from "@/lib/account-api"
import { updateProfile, updateCoreProfile, updateAvatar } from "@/lib/account-api"
import { toast } from "sonner"

interface PersonalInfoFormProps {
    profile: AccountProfile | null
    onUpdate: () => void
}

export function PersonalInfoForm({ profile, onUpdate }: PersonalInfoFormProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [formData, setFormData] = useState({
        full_name: profile?.user?.full_name || "",
        username: profile?.user?.username || "",
        username: profile?.username || "",
        email: profile?.user?.email || "",
        phone: profile?.user?.phone || "",
        gender: profile?.user?.gender || "O",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setLoading(true)
            const success = await updateAvatar(file)
            if (success) {
                toast.success("Avatar updated successfully")
                onUpdate()
            } else {
                toast.error("Failed to update avatar")
            }
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const coreSuccess = await updateCoreProfile({
                full_name: formData.full_name,
                email: formData.email,
                phone: formData.phone,
                gender: formData.gender,
            })

            const profileSuccess = await updateProfile({
                username: formData.username,
            })

            if (coreSuccess && profileSuccess) {
                toast.success("Profile updated successfully")
                setIsEditing(false)
                onUpdate()
            } else {
                toast.error("Some updates failed")
            }
        } catch (error) {
            toast.error("An error occurred while updating profile")
        } finally {
            setLoading(false)
        }
    }

    if (!profile) return null

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                <div className="relative">
                    <Avatar className="h-24 w-24 border-2 border-primary/10">
                        <AvatarImage src={profile.user.avatar || undefined} />
                        <AvatarFallback className="text-xl">
                            {profile.user.full_name?.charAt(0) || profile.user.username.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <button
                        type="button"
                        onClick={handleAvatarClick}
                        disabled={loading}
                        className="absolute -bottom-1 -right-1 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all disabled:opacity-50"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                </div>

                <div className="flex-1 space-y-1 text-center sm:text-left">
                    <h3 className="text-xl font-bold">{profile.user.full_name}</h3>
                    <p className="text-sm text-muted-foreground">@{profile.user.username}</p>
                    <p className="text-xs text-muted-foreground">Wallet Balance: ${profile.wallet_balance}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name*</Label>
                    <Input
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        placeholder="First and last name"
                        required
                        disabled={!isEditing}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Username"
                        disabled={!isEditing}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                        disabled={!isEditing}
                        value={formData.gender || "O"}
                        onValueChange={(v) => handleSelectChange("gender", v)}
                    >
                        <SelectTrigger id="gender">
                            <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="M">Male</SelectItem>
                            <SelectItem value="F">Female</SelectItem>
                            <SelectItem value="O">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email*</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email address"
                        required
                        disabled={!isEditing}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Phone*</Label>
                    <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone number"
                        required
                        disabled={!isEditing}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
                {!isEditing ? (
                    <Button type="button" onClick={() => setIsEditing(true)}>
                        Edit Profile
                    </Button>
                ) : (
                    <>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </>
                )}
            </div>
        </form>
    )
}
