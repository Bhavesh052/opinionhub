import { ChangePasswordForm } from "@/components/auth/change-password-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";

const ChangePasswordPage = async () => {
    const session = await auth();

    if (!session || !session.user) {
        redirect("/auth/login");
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="flex items-center justify-center pt-24">
                <ChangePasswordForm />
            </div>
        </div>
    );
}

export default ChangePasswordPage;
