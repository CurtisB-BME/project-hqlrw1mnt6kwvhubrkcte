import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Product } from "@/entities";
import { useToast } from "@/hooks/use-toast";
import { ProductForm } from "./ProductForm";
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

interface ProductData {
    id: string;
    name: string;
    color: string;
    bgColor: string;
}

interface ProductManagementDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ProductManagementDialog = ({ open, onOpenChange }: ProductManagementDialogProps) => {
    const [mode, setMode] = useState<"list" | "add" | "edit">("list");
    const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<ProductData | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const { data: products = [], isLoading } = useQuery({
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

    const handleAdd = () => {
        setSelectedProduct(null);
        setMode("add");
    };

    const handleEdit = (product: ProductData) => {
        setSelectedProduct(product);
        setMode("edit");
    };

    const handleDeleteClick = (product: ProductData) => {
        setProductToDelete(product);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!productToDelete) return;

        try {
            await Product.delete(productToDelete.id);
            toast({
                title: "Product deleted",
                description: `${productToDelete.name} has been removed.`,
            });
            queryClient.invalidateQueries({ queryKey: ['products'] });
        } catch (error) {
            console.error("Error deleting product:", error);
            toast({
                title: "Delete failed",
                description: "There was an error deleting the product.",
                variant: "destructive",
            });
        } finally {
            // Always close the dialog and reset state
            setDeleteDialogOpen(false);
            setProductToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setProductToDelete(null);
    };

    const handleSubmit = async (formData: { name: string; color: string; bgColor: string }) => {
        setIsSubmitting(true);
        try {
            if (mode === "add") {
                await Product.create(formData);
                toast({
                    title: "Product added",
                    description: `${formData.name} has been added to the product list.`,
                });
            } else if (mode === "edit" && selectedProduct) {
                await Product.update(selectedProduct.id, formData);
                toast({
                    title: "Product updated",
                    description: `${formData.name} has been updated.`,
                });
            }
            queryClient.invalidateQueries({ queryKey: ['products'] });
            setMode("list");
            setSelectedProduct(null);
        } catch (error) {
            console.error("Error saving product:", error);
            toast({
                title: "Save failed",
                description: "There was an error saving the product.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setMode("list");
        setSelectedProduct(null);
    };

    const handleMainDialogChange = (newOpen: boolean) => {
        if (!newOpen) {
            // Reset all state when closing main dialog
            setMode("list");
            setSelectedProduct(null);
            setDeleteDialogOpen(false);
            setProductToDelete(null);
        }
        onOpenChange(newOpen);
    };

    return (
        <>
            <Dialog open={open} onOpenChange={handleMainDialogChange} modal={true}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {mode === "list" && "Manage Products"}
                            {mode === "add" && "Add New Product"}
                            {mode === "edit" && "Edit Product"}
                        </DialogTitle>
                    </DialogHeader>

                    {mode === "list" && (
                        <div className="space-y-4 mt-4">
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-600">
                                    {products.length} {products.length === 1 ? 'product' : 'products'}
                                </p>
                                <Button onClick={handleAdd} size="sm" className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add Product
                                </Button>
                            </div>

                            {isLoading ? (
                                <div className="space-y-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-12 bg-gray-100 animate-pulse rounded" />
                                    ))}
                                </div>
                            ) : products.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No products yet. Add your first product to get started.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {products.map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                                        >
                                            <Badge className={`${product.bgColor} ${product.color} border-0`}>
                                                {product.name}
                                            </Badge>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(product)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteClick(product)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {(mode === "add" || mode === "edit") && (
                        <div className="mt-4">
                            <ProductForm
                                initialData={selectedProduct || undefined}
                                onSubmit={handleSubmit}
                                onCancel={handleCancel}
                                isSubmitting={isSubmitting}
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Product</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{productToDelete?.name}"? 
                            This won't affect existing issues, but the product won't be available for new issues.
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