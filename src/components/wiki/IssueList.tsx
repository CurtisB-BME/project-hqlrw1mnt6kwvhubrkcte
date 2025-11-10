import { IssueCard } from "./IssueCard";
import { FileQuestion } from "lucide-react";

interface Issue {
    id: string;
    title: string;
    product: string;
    status?: string;
    description: string;
    solution: string;
    ticket_ids?: string;
    external_links?: string;
    notes?: string;
    tags?: string;
    created_at: string;
    updated_at: string;
    created_by: string;
}

interface IssueListProps {
    issues: Issue[];
    onIssueClick: (issue: Issue) => void;
    isLoading?: boolean;
}

export const IssueList = ({ issues, onIssueClick, isLoading }: IssueListProps) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-lg" />
                ))}
            </div>
        );
    }

    if (issues.length === 0) {
        return (
            <div className="text-center py-16">
                <FileQuestion className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No issues found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue) => (
                <IssueCard 
                    key={issue.id} 
                    issue={issue} 
                    onClick={() => onIssueClick(issue)}
                />
            ))}
        </div>
    );
};