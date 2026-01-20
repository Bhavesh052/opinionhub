import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="border-t py-6 flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2 font-semibold text-lg">
                <img src="/logo.svg" alt="Logo" className="w-20 h-20 object-contain" />
                OpinionHub
            </div>
            <div className="flex items-center gap-6">
                <Link href="https://github.com/Bhavesh052" target="_blank">
                    <FaGithub className="text-xl hover:text-black transition" />
                </Link>
                <Link href="https://linkedin.com/in/bhavesh-bhavnani-32276525b" target="_blank">
                    <FaLinkedin className="text-xl hover:text-blue-600 transition" />
                </Link>
            </div>
            <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} OpinionHub. All rights reserved.
            </p>
        </footer>
    );
}
