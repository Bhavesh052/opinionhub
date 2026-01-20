import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Suspense } from "react";

const ResetPasswordPage = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );  
}

export default ResetPasswordPage;
