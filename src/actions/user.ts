import { db } from "@/lib/db";
export const getUserRole = async(id:string) => {
    try {
       const role= await db.user.findUnique({
        where: { id },
        select: { role: true }
    });
    return role;
    } catch (error) {
        console.error("Get User Role Error", error);
        return null;
    }
}