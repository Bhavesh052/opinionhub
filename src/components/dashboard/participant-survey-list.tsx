import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ParticipantSurveyListProps {
    surveys: any[];
}

export const ParticipantSurveyList = ({ surveys }: ParticipantSurveyListProps) => {
    return (
        <>
            {surveys.map((survey) => (
                <Card key={survey.id} className="flex flex-col transition-all hover:shadow-md">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <CardTitle className="line-clamp-1">{survey.title}</CardTitle>
                            <Badge>Active</Badge>
                        </div>
                        <CardDescription className="line-clamp-2 min-h-[40px]">
                            {survey.description || "No description provided."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="flex items-center text-sm text-muted-foreground gap-2">
                            <Calendar className="h-4 w-4" />
                            Posted {formatDistanceToNow(new Date(survey.createdAt), { addSuffix: true })}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between gap-2 border-t pt-4">
                        <Button size="sm" className="w-full" asChild>
                            <Link href={`/surveys/${survey.id}`}>
                                Take Survey <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </>
    );
};
