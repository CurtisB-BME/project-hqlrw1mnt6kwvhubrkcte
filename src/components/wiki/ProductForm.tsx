import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COLOR_OPTIONS } from "@/lib/productConfig";
import { useState, useEffect } from "react";

interface ProductFormData {
    name: string;
    color: string;
    bgColor: string;
}

interface ProductFormProps {
    initialData?: ProductFormData;
    onSubmit: (data: ProductFormData) => void;
    onCancel: () => void;
    isSubmitting: boolean;
}

export const ProductForm = ({ initialData, onSubmit, onCancel, isSubmitting }: ProductFormProps) => {
    const [formData, setFormData] = useState<ProductFormData>({
        name: "",
        color: "text-blue-700",
        bgColor: "bg-blue-100",
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleColorChange = (colorName: string) => {
        const colorOption = COLOR_OPTIONS.find(c => c.name === colorName);
        if (colorOption) {
            setFormData({
                ...formData,
                color: colorOption.color,
                bgColor: colorOption.bgColor,
            });
        }
    };

    const selectedColorName = COLOR_OPTIONS.find(
        c => c.color === formData.color && c.bgColor === formData.bgColor
    )?.name || "Blue";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="product-name">Product Name *</Label>
                <Input
                    id="product-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Cloud Services"
                    required
                />
            </div>

            <div>
                <Label htmlFor="product-color">Color Theme *</Label>
                <Select value={selectedColorName} onValueChange={handleColorChange}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {COLOR_OPTIONS.map((option) => (
                            <SelectItem key={option.name} value={option.name}>
                                <div className="flex items-center gap-2">
                                    <div className={`w-4 h-4 rounded ${option.bgColor}`} />
                                    {option.name}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-gray-500">Preview:</span>
                    <span className={`${formData.bgColor} ${formData.color} px-3 py-1 rounded text-sm font-medium`}>
                        {formData.name || "Product Name"}
                    </span>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : initialData ? "Update Product" : "Add Product"}
                </Button>
            </div>
        </form>
    );
};