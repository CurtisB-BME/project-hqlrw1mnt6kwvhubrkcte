export interface Product {
    id?: string;
    name: string;
    color: string;
    bgColor: string;
}

// Default products as fallback
export const DEFAULT_PRODUCTS: Product[] = [
    { name: "Cloud Services", color: "text-blue-700", bgColor: "bg-blue-100" },
    { name: "Enterprise Software", color: "text-purple-700", bgColor: "bg-purple-100" },
    { name: "Mobile App", color: "text-green-700", bgColor: "bg-green-100" },
    { name: "Web Platform", color: "text-orange-700", bgColor: "bg-orange-100" },
    { name: "API Services", color: "text-pink-700", bgColor: "bg-pink-100" },
    { name: "Hardware", color: "text-gray-700", bgColor: "bg-gray-100" },
    { name: "Consulting", color: "text-indigo-700", bgColor: "bg-indigo-100" },
    { name: "Other", color: "text-slate-700", bgColor: "bg-slate-100" },
];

// Available color options for products
export const COLOR_OPTIONS = [
    { name: "Blue", color: "text-blue-700", bgColor: "bg-blue-100" },
    { name: "Purple", color: "text-purple-700", bgColor: "bg-purple-100" },
    { name: "Green", color: "text-green-700", bgColor: "bg-green-100" },
    { name: "Orange", color: "text-orange-700", bgColor: "bg-orange-100" },
    { name: "Pink", color: "text-pink-700", bgColor: "bg-pink-100" },
    { name: "Red", color: "text-red-700", bgColor: "bg-red-100" },
    { name: "Yellow", color: "text-yellow-700", bgColor: "bg-yellow-100" },
    { name: "Indigo", color: "text-indigo-700", bgColor: "bg-indigo-100" },
    { name: "Teal", color: "text-teal-700", bgColor: "bg-teal-100" },
    { name: "Cyan", color: "text-cyan-700", bgColor: "bg-cyan-100" },
    { name: "Gray", color: "text-gray-700", bgColor: "bg-gray-100" },
    { name: "Slate", color: "text-slate-700", bgColor: "bg-slate-100" },
];

export const getProductColor = (productName: string, products: Product[]): Product => {
    const product = products.find(p => p.name === productName);
    return product || { name: "Other", color: "text-slate-700", bgColor: "bg-slate-100" };
};