"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Pencil, Home, Briefcase, MapPin } from "lucide-react"
import {
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    type Address,
} from "@/lib/account-api"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"
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

export function AddressList() {
    const [addresses, setAddresses] = useState<Address[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingAddress, setEditingAddress] = useState<Address | null>(null)
    const [formData, setFormData] = useState<Omit<Address, "id">>({
        address_type: "home",
        full_name: "",
        phone_number: "",
        street_address: "",
        city: "",
        state: "",
        country: "",
        zip_code: "",
        is_default: false,
    })

    useEffect(() => {
        loadAddresses()
    }, [])

    const loadAddresses = async () => {
        setLoading(true)
        const data = await fetchAddresses()
        setAddresses(data)
        setLoading(false)
    }

    const handleOpenDialog = (address?: Address) => {
        if (address) {
            setEditingAddress(address)
            setFormData({
                address_type: address.address_type as any,
                full_name: address.full_name,
                phone_number: address.phone_number,
                street_address: address.street_address,
                city: address.city,
                state: address.state,
                country: address.country,
                zip_code: address.zip_code,
                is_default: address.is_default,
            })
        } else {
            setEditingAddress(null)
            setFormData({
                address_type: "home",
                full_name: "",
                phone_number: "",
                street_address: "",
                city: "",
                state: "",
                country: "",
                zip_code: "",
                is_default: addresses.length === 0,
            })
        }
        setIsDialogOpen(true)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        let result
        if (editingAddress) {
            result = await updateAddress(editingAddress.id, formData)
        } else {
            result = await createAddress(formData)
        }

        if (result) {
            toast.success(editingAddress ? "Address updated" : "Address created")
            setIsDialogOpen(false)
            loadAddresses()
        } else {
            toast.error("Failed to save address")
        }
        setLoading(false)
    }

    const handleDelete = async (id: number) => {
        const success = await deleteAddress(id)
        if (success) {
            toast.success("Address deleted")
            loadAddresses()
        } else {
            toast.error("Failed to delete address")
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "home":
                return <Home className="h-4 w-4" />
            case "office":
                return <Briefcase className="h-4 w-4" />
            default:
                return <MapPin className="h-4 w-4" />
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Delivery Addresses</h3>
                <Button onClick={() => handleOpenDialog()} variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add New
                </Button>
            </div>

            {loading && addresses.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-4 h-32 bg-accent/50 rounded-lg" />
                        </Card>
                    ))}
                </div>
            ) : addresses.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center p-8 text-muted-foreground">
                        <MapPin className="h-12 w-12 mb-4 opacity-20" />
                        <p>No addresses added yet</p>
                        <Button onClick={() => handleOpenDialog()} variant="link">Add your first address</Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                        <Card key={address.id} className={address.is_default ? "border-primary" : ""}>
                            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    {getTypeIcon(address.address_type)}
                                    <span className="capitalize">{address.address_type}</span>
                                    {address.is_default && (
                                        <span className="ml-2 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>
                                    )}
                                </CardTitle>
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                        onClick={() => handleOpenDialog(address)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Address?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to remove this delivery address?
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDelete(address.id)}
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 text-sm">
                                <p className="font-semibold">{address.full_name}</p>
                                <p className="text-muted-foreground">{address.street_address}</p>
                                <p className="text-muted-foreground">
                                    {address.city}, {address.state} {address.zip_code}
                                </p>
                                <p className="text-muted-foreground">{address.country}</p>
                                <p className="mt-2 text-xs font-mono">{address.phone_number}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="address_type">Type</Label>
                                <Select
                                    value={formData.address_type}
                                    onValueChange={(v) => handleSelectChange("address_type", v)}
                                >
                                    <SelectTrigger id="address_type">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="home">Home</SelectItem>
                                        <SelectItem value="office">Office</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="full_name">Full Name*</Label>
                                <Input
                                    id="full_name"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone_number">Phone Number*</Label>
                            <Input
                                id="phone_number"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="street_address">Street Address*</Label>
                            <Input
                                id="street_address"
                                name="street_address"
                                value={formData.street_address}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">City*</Label>
                                <Input
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state">State/Province</Label>
                                <Input
                                    id="state"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="country">Country*</Label>
                                <Input
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="zip_code">Zip Code*</Label>
                                <Input
                                    id="zip_code"
                                    name="zip_code"
                                    value={formData.zip_code}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="is_default"
                                checked={formData.is_default}
                                onCheckedChange={(checked) =>
                                    setFormData((prev) => ({ ...prev, is_default: !!checked }))
                                }
                            />
                            <Label htmlFor="is_default" className="text-sm font-normal">
                                Set as default delivery address
                            </Label>
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Saving..." : editingAddress ? "Update Address" : "Save Address"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
