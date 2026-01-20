import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Shield, Calendar, KeyRound } from "lucide-react";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ProfilePage() {
    const session = await auth();

    if (!session || !session.user) {
        redirect("/auth/login");
    }

    const { user } = session;

    const dbUser = await db.user.findUnique({
        where: { id: user.id },
        select: { createdAt: true, role: true }
    });

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-24 pb-12 max-w-2xl mx-auto px-4">
                <Card className="shadow-lg">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto mb-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={user.image || ""} alt={user.name || ""} />
                                <AvatarFallback className="text-2xl">{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </div>
                        <CardTitle className="text-2xl">{user.name}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                        <div className="mt-2">
                            <Badge variant="secondary" className="capitalize">
                                {dbUser?.role?.toLowerCase() || "User"}
                            </Badge>
                        </div>
                    </CardHeader>
                    <Separator />
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Full Name</p>
                                <p className="text-sm text-muted-foreground">{user.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Email Address</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
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
                                {/* Assuming all users have createdAt, fallback to now if missing */}
                                <p className="text-sm text-muted-foreground">
                                    {dbUser?.createdAt ? format(new Date(dbUser.createdAt), "MMMM do, yyyy") : "N/A"}
                                </p>
                            </div>
                        </div>

                        <Separator className="my-6" />

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <KeyRound className="h-5 w-5 text-primary" />
                                Security
                            </h3>
                            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                                <p className="text-sm text-muted-foreground mb-4">
                                    To change your password, we will send a verification code to your registered email address.
                                </p>
                                <Button asChild variant="outline" className="w-full">
                                    <Link href={`/auth/forgot-password?email=${user.email}`}>
                                        Change Password
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
