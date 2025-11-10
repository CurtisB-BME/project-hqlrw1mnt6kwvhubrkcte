import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@/entities";
import { DEFAULT_PRODUCTS } from "@/lib/productConfig";

interface ProductData {
    id: string;
    name: string;
    color: string;
    bgColor: string;
}

interface ProductFilterProps {
    selectedProduct: string;
    onProductChange: (product: string) => void;
    issueCount?: number;
}

export const ProductFilter = ({ selectedProduct, onProductChange, issueCount }: ProductFilterProps) => {
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

    // Use database products if available, otherwise fall back to defaults
    const products = dbProducts.length > 0 ? dbProducts : DEFAULT_PRODUCTS;

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
                    {products.map((product) => (
                        <SelectItem key={product.name} value={product.name}>
                            {product.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};