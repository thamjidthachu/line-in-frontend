"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProfileSidebar } from "@/components/profile/profile-sidebar"
import { PersonalInfoForm } from "@/components/profile/personal-info-form"
import { AddressList } from "@/components/profile/address-list"
import { fetchAccountDashboard, type AccountDashboardData } from "@/lib/account-api"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Skeleton } from "@/components/ui/skeleton"
import { ShieldCheck, Mail, MapPinned, Heart, Info, LayoutDashboard } from "lucide-react"
import { ProfileOrders } from "@/components/profile/profile-orders"

export default function ProfilePage() {
    const { isAuthenticated, isLoading: authLoading } = useAuth()
    const router = useRouter()
    const [activeSection, setActiveSection] = useState("profile")
    const [dashboardData, setDashboardData] = useState<AccountDashboardData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/auth/login")
        }
    }, [isAuthenticated, authLoading, router])

    useEffect(() => {
        if (isAuthenticated) {
            loadDashboard()
        }
    }, [isAuthenticated])

    const loadDashboard = async () => {
        setLoading(true)
        const data = await fetchAccountDashboard()
        setDashboardData(data)
        setLoading(false)
    }

    if (authLoading || (!isAuthenticated && !authLoading)) {
        return null // Handled by useEffect redirect
    }

    const renderContent = () => {
        switch (activeSection) {
            case "profile":
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">PERSONAL DATA</h1>
                            <p className="text-muted-foreground mt-2">
                                Manage your personal information, security, and addresses.
                            </p>
                        </div>

                        <Accordion type="multiple" defaultValue={["personal-info"]} className="w-full space-y-4">
                            <AccordionItem value="personal-info" className="border rounded-xl px-4 bg-card shadow-sm overflow-hidden">
                                <AccordionTrigger className="hover:no-underline py-6">
                                    <div className="flex items-center gap-3 text-left">
                                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                                            <Info className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <span className="text-lg font-semibold block">Personal Info</span>
                                            <span className="text-sm text-muted-foreground font-normal">Update your basic details and avatar</span>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-8">
                                    <PersonalInfoForm profile={dashboardData?.profile || null} onUpdate={loadDashboard} />
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="addresses" className="border rounded-xl px-4 bg-card shadow-sm overflow-hidden">
                                <AccordionTrigger className="hover:no-underline py-6">
                                    <div className="flex items-center gap-3 text-left">
                                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                                            <MapPinned className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <span className="text-lg font-semibold block">Delivery Addresses</span>
                                            <span className="text-sm text-muted-foreground font-normal">Manage your shipping locations</span>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-8">
                                    <AddressList />
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="security" className="border rounded-xl px-4 bg-card shadow-sm overflow-hidden">
                                <AccordionTrigger className="hover:no-underline py-6">
                                    <div className="flex items-center gap-3 text-left">
                                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                                            <ShieldCheck className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <span className="text-lg font-semibold block">Security</span>
                                            <span className="text-sm text-muted-foreground font-normal">Password and account protection</span>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-8">
                                    <div className="p-4 border rounded-lg bg-muted/30 text-center">
                                        <p className="text-muted-foreground">Security settings integration coming soon.</p>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="interests" className="border rounded-xl px-4 bg-card shadow-sm overflow-hidden">
                                <AccordionTrigger className="hover:no-underline py-6">
                                    <div className="flex items-center gap-3 text-left">
                                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                                            <Heart className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <span className="text-lg font-semibold block">Interests</span>
                                            <span className="text-sm text-muted-foreground font-normal">Things you love and follow</span>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-8">
                                    <div className="flex flex-wrap gap-2">
                                        {dashboardData?.profile?.interests?.length ? (
                                            dashboardData.profile.interests.map((interest) => (
                                                <span key={interest.id} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                                    {interest.name}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-muted-foreground italic">No interests specified yet.</p>
                                        )}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                )
            case "orders":
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ProfileOrders />
                    </div>
                )
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-[400px] border border-dashed rounded-2xl bg-muted/10 animate-in fade-in duration-500">
                        <LayoutDashboard className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                        <h2 className="text-xl font-semibold mb-2">{activeSection.toUpperCase()} Section</h2>
                        <p className="text-muted-foreground">This section is currently under development.</p>
                    </div>
                )
        }
    }

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Navbar />
            <main className="flex-1 py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Sidebar */}
                        <aside className="lg:w-1/4">
                            <div className="sticky top-24">
                                <ProfileSidebar
                                    activeSection={activeSection}
                                    onSectionChange={setActiveSection}
                                />
                            </div>
                        </aside>

                        {/* Main Content */}
                        <section className="flex-1 lg:max-w-4xl">
                            {loading ? (
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <Skeleton className="h-10 w-64" />
                                        <Skeleton className="h-4 w-96" />
                                    </div>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map((i) => (
                                            <Skeleton key={i} className="h-20 w-full rounded-xl" />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                renderContent()
                            )}
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
