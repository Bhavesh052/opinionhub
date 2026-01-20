import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t py-6 flex items-center justify-center">
      <div className="flex items-center gap-6">
        <Link href="https://github.com/Bhavesh052" target="_blank">
          <FaGithub className="text-xl hover:text-black transition" />
        </Link>
        <Link href="https://linkedin.com/in/bhavesh-bhavnani-32276525b" target="_blank">
          <FaLinkedin className="text-xl hover:text-blue-600 transition" />
        </Link>
      </div>
    </footer>
  );
}
