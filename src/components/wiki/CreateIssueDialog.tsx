import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEFAULT_PRODUCTS } from "@/lib/productConfig";
import { useState } from "react";
import { Issue, Product } from "@/entities";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useQuery } from "@tanstack/react-query";

interface ProductData {
    id: string;
    name: string;
    color: string;
    bgColor: string;
}

interface CreateIssueDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const CreateIssueDialog = ({ open, onOpenChange }: CreateIssueDialogProps) => {
    const [formData, setFormData] = useState({
        title: "",
        product: "",
        status: "Unsolved",
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

    const products = dbProducts.length > 0 ? dbProducts : DEFAULT_PRODUCTS;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.title || !formData.product || !formData.description || !formData.solution) {
            toast({
                title: "Missing required fields",
                description: "Please fill in all required fields.",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await Issue.create(formData);
            toast({
                title: "Issue created",
                description: "The issue has been added to the wiki.",
            });
            queryClient.invalidateQueries({ queryKey: ['issues'] });
            setFormData({
                title: "",
                product: "",
                status: "Unsolved",
                description: "",
                solution: "",
                ticket_ids: "",
                external_links: "",
                notes: "",
                tags: "",
            });
            onOpenChange(false);
        } catch (error) {
            console.error("Error creating issue:", error);
            toast({
                title: "Creation failed",
                description: "There was an error creating the issue.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Issue</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                        <Label htmlFor="title">Issue Title *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Brief description of the issue"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="product">Product *</Label>
                            <Select value={formData.product} onValueChange={(value) => setFormData({ ...formData, product: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a product" />
                                </SelectTrigger>
                                <SelectContent>
                                    {products.map((product) => (
                                        <SelectItem key={product.name} value={product.name}>
                                            {product.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="status">Status *</Label>
                            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Unsolved">Unsolved</SelectItem>
                                    <SelectItem value="Solved">Solved</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description">Issue Description *</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Detailed description of the issue"
                            rows={4}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="solution">Solution *</Label>
                        <Textarea
                            id="solution"
                            value={formData.solution}
                            onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                            placeholder="How to resolve this issue"
                            rows={4}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="ticket_ids">Related Ticket IDs</Label>
                        <Input
                            id="ticket_ids"
                            value={formData.ticket_ids}
                            onChange={(e) => setFormData({ ...formData, ticket_ids: e.target.value })}
                            placeholder="Comma-separated ticket IDs (e.g., TICK-123, TICK-456)"
                        />
                    </div>

                    <div>
                        <Label htmlFor="external_links">External Links</Label>
                        <Textarea
                            id="external_links"
                            value={formData.external_links}
                            onChange={(e) => setFormData({ ...formData, external_links: e.target.value })}
                            placeholder="Comma-separated URLs (e.g., https://example.com, https://docs.example.com)"
                            rows={2}
                        />
                    </div>

                    <div>
                        <Label htmlFor="notes">Additional Notes</Label>
                        <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Any additional context or information"
                            rows={3}
                        />
                    </div>

                    <div>
                        <Label htmlFor="tags">Tags</Label>
                        <Input
                            id="tags"
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
                            {isSubmitting ? "Creating..." : "Create Issue"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};