import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductFilter } from "./ProductFilter";

interface SearchBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedProduct: string;
    onProductChange: (product: string) => void;
    issueCount?: number;
}

export const SearchBar = ({ 
    searchQuery, 
    onSearchChange, 
    selectedProduct, 
    onProductChange,
    issueCount 
}: SearchBarProps) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search issues, solutions, tags..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <ProductFilter 
                    selectedProduct={selectedProduct}
                    onProductChange={onProductChange}
                    issueCount={issueCount}
                />
            </div>
        </div>
    );
};