import { BookOpen, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/entities";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { ProductManagementDialog } from "./ProductManagementDialog";

export const WikiHeader = () => {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { toast } = useToast();
    const { data: user } = useQuery({
        queryKey: ['current-user'],
        queryFn: async () => {
            try {
                return await User.me();
            } catch (error) {
                console.error("Error fetching user:", error);
                return null;
            }
        }
    });

    const handleLogout = async () => {
        try {
            await User.logout();
            toast({
                title: "Logged out successfully",
                description: "You have been logged out of the wiki.",
            });
        } catch (error) {
            console.error("Logout error:", error);
            toast({
                title: "Logout failed",
                description: "There was an error logging out. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <>
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                                <BookOpen className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Tech Support Wiki</h1>
                                <p className="text-xs text-gray-500">Knowledge Base</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            {user && (
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                            )}
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSettingsOpen(true)}
                                className="gap-2"
                            >
                                <Settings className="h-4 w-4" />
                                <span className="hidden sm:inline">Products</span>
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={handleLogout}
                                className="gap-2"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <ProductManagementDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
        </>
    );
};