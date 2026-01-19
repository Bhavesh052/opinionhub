import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BarChart2, Edit, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SurveyListProps {
    surveys: any[];
}

export const SurveyList = ({ surveys }: SurveyListProps) => {
    return (
        <>
            {surveys.map((survey) => (
                <Card key={survey.id} className="flex flex-col transition-all hover:shadow-md">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <CardTitle className="line-clamp-1">{survey.title}</CardTitle>
                            <Badge variant={survey.status === "ACTIVE" ? "default" : "secondary"}>
                                {survey.status === "ACTIVE" ? "Active" : "Draft"}
                            </Badge>
                        </div>
                        <CardDescription className="line-clamp-2 min-h-[40px]">
                            {survey.description || "No description provided."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="flex items-center text-sm text-muted-foreground gap-2">
                            <Calendar className="h-4 w-4" />
                            {formatDistanceToNow(new Date(survey.createdAt), { addSuffix: true })}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground gap-2 mt-2">
                            <BarChart2 className="h-4 w-4" />
                            {survey._count.responses} Response{survey._count.responses !== 1 && 's'}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between gap-2 border-t pt-4">
                        <Button variant="outline" size="sm" className="w-full" asChild>
                            <Link href={`/surveys/${survey.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                            </Link>
                        </Button>
                        <Button variant="secondary" size="sm" className="w-full" asChild>
                            <Link href={`/surveys/${survey.id}/stats`}>
                                Results
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </>
    );
};
