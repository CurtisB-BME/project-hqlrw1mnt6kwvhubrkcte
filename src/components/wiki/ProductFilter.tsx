import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PRODUCTS } from "@/lib/productConfig";
import { Package } from "lucide-react";

interface ProductFilterProps {
    selectedProduct: string;
    onProductChange: (product: string) => void;
    issueCount?: number;
}

export const ProductFilter = ({ selectedProduct, onProductChange, issueCount }: ProductFilterProps) => {
    return (
        <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-gray-500" />
            <Select value={selectedProduct} onValueChange={onProductChange}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Products" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">
                        All Products {issueCount !== undefined && `(${issueCount})`}
                    </SelectItem>
                    {PRODUCTS.map((product) => (
                        <SelectItem key={product.name} value={product.name}>
                            {product.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};