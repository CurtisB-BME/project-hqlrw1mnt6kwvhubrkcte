import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Tag, Clock } from "lucide-react";
import { getProductColor } from "@/lib/productConfig";
import { format } from "date-fns";

interface Issue {
    id: string;
    title: string;
    product: string;
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

interface IssueCardProps {
    issue: Issue;
    onClick: () => void;
}

export const IssueCard = ({ issue, onClick }: IssueCardProps) => {
    const productColor = getProductColor(issue.product);
    const tags = issue.tags ? issue.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    
    return (
        <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-l-4"
            style={{ borderLeftColor: productColor.bgColor.replace('bg-', '#') }}
            onClick={onClick}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge className={`${productColor.bgColor} ${productColor.color} border-0`}>
                        {issue.product}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {format(new Date(issue.updated_at), 'MMM d, yyyy')}
                    </div>
                </div>
                <CardTitle className="text-lg leading-tight">{issue.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {issue.description}
                </p>
                
                {tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                        <Tag className="h-3 w-3 text-gray-400" />
                        {tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {tag}
                            </span>
                        ))}
                        {tags.length > 3 && (
                            <span className="text-xs text-gray-400">+{tags.length - 3} more</span>
                        )}
                    </div>
                )}
                
                {issue.external_links && (
                    <div className="flex items-center gap-1 text-xs text-blue-600 mt-2">
                        <ExternalLink className="h-3 w-3" />
                        <span>External resources available</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};