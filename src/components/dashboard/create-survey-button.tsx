"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export const CreateSurveyButton = () => {
    return (
        <Button asChild>
            <Link href="/dashboard/create">
                <Plus className="mr-2 h-4 w-4" /> Create Survey
            </Link>
        </Button>
    );
};
