import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PRODUCTS } from "@/lib/productConfig";
import { useState, useEffect } from "react";
import { Issue } from "@/entities";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

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
}

interface EditIssueDialogProps {
    issue: IssueData | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const EditIssueDialog = ({ issue, open, onOpenChange }: EditIssueDialogProps) => {
    const [formData, setFormData] = useState({
        title: "",
        product: "",
        description: "",
        solution: "",
        ticket_ids: "",
        external_links: "",
        notes: "",
        tags: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (issue) {
            setFormData({
                title: issue.title,
                product: issue.product,
                description: issue.description,
                solution: issue.solution,
                ticket_ids: issue.ticket_ids || "",
                external_links: issue.external_links || "",
                notes: issue.notes || "",
                tags: issue.tags || "",
            });
        }
    }, [issue]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!issue || !formData.title || !formData.product || !formData.description || !formData.solution) {
            toast({
                title: "Missing required fields",
                description: "Please fill in all required fields.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await Issue.update(issue.id, formData);
            toast({
                title: "Issue updated",
                description: "The issue has been updated successfully.",
            });
            queryClient.invalidateQueries({ queryKey: ['issues'] });
            onOpenChange(false);
        } catch (error) {
            console.error("Error updating issue:", error);
            toast({
                title: "Update failed",
                description: "There was an error updating the issue.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!issue) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Issue</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                        <Label htmlFor="edit-title">Issue Title *</Label>
                        <Input
                            id="edit-title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Brief description of the issue"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="edit-product">Product *</Label>
                        <Select value={formData.product} onValueChange={(value) => setFormData({ ...formData, product: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a product" />
                            </SelectTrigger>
                            <SelectContent>
                                {PRODUCTS.map((product) => (
                                    <SelectItem key={product.name} value={product.name}>
                                        {product.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="edit-description">Issue Description *</Label>
                        <Textarea
                            id="edit-description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Detailed description of the issue"
                            rows={4}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="edit-solution">Solution *</Label>
                        <Textarea
                            id="edit-solution"
                            value={formData.solution}
                            onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                            placeholder="How to resolve this issue"
                            rows={4}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="edit-ticket_ids">Related Ticket IDs</Label>
                        <Input
                            id="edit-ticket_ids"
                            value={formData.ticket_ids}
                            onChange={(e) => setFormData({ ...formData, ticket_ids: e.target.value })}
                            placeholder="Comma-separated ticket IDs (e.g., TICK-123, TICK-456)"
                        />
                    </div>

                    <div>
                        <Label htmlFor="edit-external_links">External Links</Label>
                        <Textarea
                            id="edit-external_links"
                            value={formData.external_links}
                            onChange={(e) => setFormData({ ...formData, external_links: e.target.value })}
                            placeholder="Comma-separated URLs (e.g., https://example.com, https://docs.example.com)"
                            rows={2}
                        />
                    </div>

                    <div>
                        <Label htmlFor="edit-notes">Additional Notes</Label>
                        <Textarea
                            id="edit-notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Any additional context or information"
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="edit-tags">Tags</Label>
                        <Input
                            id="edit-tags"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            placeholder="Comma-separated tags (e.g., login, authentication, error)"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Updating..." : "Update Issue"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};