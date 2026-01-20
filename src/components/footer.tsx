import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-2 font-semibold text-lg">
          <img src="/logo.svg" alt="Logo" className="w-10 h-10 object-contain" />
          OpinionHub
        </div>

        {/* Right */}
        <div className="flex items-center gap-6">
          <Link href="https://github.com/Bhavesh052" target="_blank">
            <FaGithub className="text-xl hover:text-black transition" />
          </Link>
          <Link href="https://linkedin.com/in/bhavesh-bhavnani-32276525b" target="_blank">
            <FaLinkedin className="text-xl hover:text-blue-600 transition" />
          </Link>
        </div>
      </div>

      {/* Bottom */}
      <p className="text-xs text-muted-foreground text-center mt-4">
        © {new Date().getFullYear()} OpinionHub. All rights reserved.
      </p>
    </footer>
  );
}
