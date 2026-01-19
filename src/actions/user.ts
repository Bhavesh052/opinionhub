import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
export const getUserRole = async(id:string) => {
    try {
       const role= await db.user.findUnique({
        where: { id },
        select: { role: true }
    });
    return role;
    } catch (error) {
        logger.error("Get User Role Error", error);
        return null;
    }
}