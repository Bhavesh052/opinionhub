import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Shield, Calendar, KeyRound, Pencil, X, Check } from "lucide-react";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { updateProfile } from "@/actions/user";
import { Input } from "@/components/ui/input";

export default async function ProfilePage({
    searchParams
}: {
    searchParams: Promise<{ edit?: string, error?: string, success?: string }>
}) {
    const session = await auth();
    const { edit, error, success } = await searchParams;
    const isEditing = edit === "true";

    if (!session || !session.user) {
        redirect("/auth/login");
    }

    const { user } = session;

    const dbUser = await db.user.findUnique({
        where: { id: user.id },
        select: { createdAt: true, role: true, name: true, email: true, demographics: true }
    });

    const demographics = (dbUser?.demographics as any) || {};

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-24 pb-12 max-w-2xl mx-auto px-4">
                <form action={async (formData: FormData) => {
                    "use server";
                    const name = formData.get("name") as string;
                    const email = formData.get("email") as string;
                    const gender = formData.get("gender") as string;
                    const dob = formData.get("dob") as string;
                    const annualIncome = formData.get("annualIncome") as string;

                    const result = await updateProfile({ name, email, gender, dob, annualIncome });
                    if (result.error) {
                        redirect(`/profile?edit=true&error=${encodeURIComponent(result.error)}`);
                    } else {
                        redirect(`/profile?success=${encodeURIComponent(result.success || "Updated")}`);
                    }
                }}>
                    <Card className="shadow-lg">
                        <CardHeader className="text-center pb-2 relative">
                            {!isEditing && (
                                <Button asChild variant="ghost" size="icon" className="absolute top-4 right-4 h-8 w-8">
                                    <Link href="/profile?edit=true">
                                        <Pencil className="h-4 w-4" />
                                    </Link>
                                </Button>
                            )}
                            <div className="mx-auto mb-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={user.image || ""} alt={user.name || ""} />
                                    <AvatarFallback className="text-2xl">{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </div>
                            {isEditing ? (
                                <div className="space-y-2 max-w-sm mx-auto">
                                    <Input defaultValue={dbUser?.name || user.name || ""} name="name" className="text-center text-2xl font-bold h-auto py-1" placeholder="Name" />
                                    <Input defaultValue={dbUser?.email || user.email || ""} name="email" type="email" className="text-center text-sm h-auto py-1" placeholder="Email" />
                                </div>
                            ) : (
                                <>
                                    <CardTitle className="text-2xl">{dbUser?.name || user.name}</CardTitle>
                                    <CardDescription>{dbUser?.email || user.email}</CardDescription>
                                </>
                            )}
                            <div className="mt-2">
                                <Badge variant="secondary" className="capitalize">
                                    {dbUser?.role?.toLowerCase() || "User"}
                                </Badge>
                            </div>
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-6 space-y-4">
                            {error && (
                                <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm text-center">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="p-3 rounded-md bg-emerald-500/15 text-emerald-500 text-sm text-center">
                                    {success}
                                </div>
                            )}

                            {/* View Mode (ReadOnly) */}
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border">
                                <User className="h-5 w-5 text-muted-foreground" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Full Name</p>
                                    <p className="text-sm text-muted-foreground">{dbUser?.name || user.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Email Address</p>
                                    <p className="text-sm text-muted-foreground">{dbUser?.email || user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border">
                                <Shield className="h-5 w-5 text-muted-foreground" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Role</p>
                                    <p className="text-sm text-muted-foreground capitalize">{dbUser?.role?.toLowerCase()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Joined On</p>
                                    <p className="text-sm text-muted-foreground">
                                        {dbUser?.createdAt ? format(new Date(dbUser.createdAt), "MMMM do, yyyy") : "N/A"}
                                    </p>
                                </div>
                            </div>

                            <Separator className="my-6" />

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <User className="h-5 w-5 text-primary" />
                                    Demographics
                                </h3>
                                {isEditing ? (
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Gender</label>
                                            <select
                                                name="gender"
                                                defaultValue={demographics.gender || ""}
                                                className="w-full p-2 rounded-md border bg-background"
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="MALE">Male</option>
                                                <option value="FEMALE">Female</option>
                                                <option value="OTHER">Other</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Date of Birth</label>
                                            <Input
                                                name="dob"
                                                type="date"
                                                defaultValue={demographics.dob || ""}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Annual Income</label>
                                            <Input
                                                name="annualIncome"
                                                placeholder="e.g. $50,000"
                                                defaultValue={demographics.annualIncome || ""}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid gap-3">
                                        <div className="flex justify-between p-2 rounded bg-slate-50/50 border">
                                            <span className="text-sm font-medium">Gender</span>
                                            <span className="text-sm text-muted-foreground capitalize">{demographics.gender?.toLowerCase() || "Not set"}</span>
                                        </div>
                                        <div className="flex justify-between p-2 rounded bg-slate-50/50 border">
                                            <span className="text-sm font-medium">Date of Birth</span>
                                            <span className="text-sm text-muted-foreground">{demographics.dob || "Not set"}</span>
                                        </div>
                                        <div className="flex justify-between p-2 rounded bg-slate-50/50 border">
                                            <span className="text-sm font-medium">Annual Income</span>
                                            <span className="text-sm text-muted-foreground">{demographics.annualIncome || "Not set"}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Separator className="my-6" />

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <KeyRound className="h-5 w-5 text-primary" />
                                    Security
                                </h3>
                                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Securely update your password. You will be required to enter your current password.
                                    </p>
                                    <Button asChild variant="outline" className="w-full">
                                        <Link href={`/profile/change-password`}>
                                            Change Password
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                        {isEditing && (
                            <CardFooter className="flex gap-2 justify-end bg-slate-50/50 border-t pt-4">
                                <Button asChild variant="ghost" size="sm" className="gap-2">
                                    <Link href="/profile">
                                        <X className="h-4 w-4" /> Cancel
                                    </Link>
                                </Button>
                                <Button type="submit" size="sm" className="gap-2">
                                    <Check className="h-4 w-4" /> Save Changes
                                </Button>
                            </CardFooter>
                        )}
                    </Card>
                </form>
            </div>
        </div>
    );
}
