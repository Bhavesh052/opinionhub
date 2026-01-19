import { auth } from "@/auth";
import { NavbarClient } from "./navbar-client";

export const Navbar = async () => {
    const session = await auth();
    return <NavbarClient user={session?.user} />;
};
