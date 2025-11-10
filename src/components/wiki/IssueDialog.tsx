import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Tag, Ticket, FileText, Clock, User, Edit, Trash2 } from "lucide-react";
import { getProductColor, DEFAULT_PRODUCTS } from "@/lib/productConfig";
import { format } from "date-fns";
import { useState } from "react";
import { EditIssueDialog } from "./EditIssueDialog";
import { Issue, Product } from "@/entities";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface IssueData {
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

interface ProductData {
    id: string;
    name: string;
    color: string;
    bgColor: string;
}

interface IssueDialogProps {
    issue: IssueData | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const IssueDialog = ({ issue, open, onOpenChange }: IssueDialogProps) => {
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: dbProducts = [] } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            try {
                const result = await Product.list('name', 1000);
                return result as ProductData[];
            } catch (error) {
                console.error("Error fetching products:", error);
                return [];
            }
        }
    });

    if (!issue) return null;

    const products = dbProducts.length > 0 ? dbProducts : DEFAULT_PRODUCTS;
    const productColor = getProductColor(issue.product, products);
    const tags = issue.tags ? issue.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    const ticketIds = issue.ticket_ids ? issue.ticket_ids.split(',').map(t => t.trim()).filter(Boolean) : [];
    const externalLinks = issue.external_links ? issue.external_links.split(',').map(l => l.trim()).filter(Boolean) : [];

    const handleDeleteClick = () => {
        console.log("Delete clicked for issue:", issue.title);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        console.log("Starting delete for issue:", issue.title);
        
        try {
            await Issue.delete(issue.id);
            console.log("Issue deleted successfully");
            
            toast({
                title: "Issue deleted",
                description: "The issue has been removed from the wiki.",
            });
            
            // Refresh the issue list
            await queryClient.invalidateQueries({ queryKey: ['issues'] });
            
            // Close both dialogs
            setDeleteDialogOpen(false);
            onOpenChange(false);
        } catch (error) {
            console.error("Error deleting issue:", error);
            toast({
                title: "Delete failed",
                description: "There was an error deleting the issue.",
                variant: "destructive",
            });
        } finally {
            setDeleteDialogOpen(false);
        }
    };

    const handleDeleteCancel = () => {
        console.log("Delete cancelled");
        setDeleteDialogOpen(false);
    };

    const handleMainDialogChange = (newOpen: boolean) => {
        // Don't close the main dialog if the delete dialog is open
        if (!newOpen && deleteDialogOpen) {
            console.log("Preventing main dialog close - delete dialog is open");
            return;
        }
        
        // Don't close the main dialog if the edit dialog is open
        if (!newOpen && editDialogOpen) {
            console.log("Preventing main dialog close - edit dialog is open");
            return;
        }
        
        if (!newOpen) {
            // Reset state when closing
            setEditDialogOpen(false);
            setDeleteDialogOpen(false);
        }
        
        onOpenChange(newOpen);
    };

    return (
        <>
            <Dialog open={open} onOpenChange={handleMainDialogChange}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <Badge className={`${productColor.bgColor} ${productColor.color} border-0`}>
                                {issue.product}
                            </Badge>
                            <div className="flex gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setEditDialogOpen(true)}
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={handleDeleteClick}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                        <DialogTitle className="text-2xl">{issue.title}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 mt-4">
                        <div>
                            <h3 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Issue Description
                            </h3>
                            <p className="text-gray-700 whitespace-pre-wrap">{issue.description}</p>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="font-semibold text-sm text-green-700 mb-2 flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Solution
                            </h3>
                            <p className="text-gray-700 whitespace-pre-wrap">{issue.solution}</p>
                        </div>

                        {ticketIds.length > 0 && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-2">
                                        <Ticket className="h-4 w-4" />
                                        Related Ticket IDs
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {ticketIds.map((ticketId, idx) => (
                                            <Badge key={idx} variant="outline">
                                                {ticketId}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {externalLinks.length > 0 && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-2">
                                        <ExternalLink className="h-4 w-4" />
                                        External Resources
                                    </h3>
                                    <div className="space-y-2">
                                        {externalLinks.map((link, idx) => (
                                            <a
                                                key={idx}
                                                href={link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                                            >
                                                <ExternalLink className="h-3 w-3" />
                                                {link}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {issue.notes && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Additional Notes
                                    </h3>
                                    <p className="text-gray-700 whitespace-pre-wrap">{issue.notes}</p>
                                </div>
                            </>
                        )}

                        {tags.length > 0 && (
                            <>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-2">
                                        <Tag className="h-4 w-4" />
                                        Tags
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag, idx) => (
                                            <Badge key={idx} variant="secondary">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        <Separator />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>Created by: {issue.created_by}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>Created: {format(new Date(issue.created_at), 'PPP')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>Updated: {format(new Date(issue.updated_at), 'PPP')}</span>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <EditIssueDialog
                issue={issue}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
            />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Issue</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{issue.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleDeleteCancel}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};