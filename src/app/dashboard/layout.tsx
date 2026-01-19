import { Navbar } from "@/components/layout/navbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <div className="flex-1 space-y-4 p-8 pt-20">
                {children}
            </div>
        </div>
    );
}
