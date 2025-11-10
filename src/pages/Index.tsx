import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Issue } from "@/entities";
import { WikiHeader } from "@/components/wiki/WikiHeader";
import { SearchBar } from "@/components/wiki/SearchBar";
import { IssueList } from "@/components/wiki/IssueList";
import { IssueDialog } from "@/components/wiki/IssueDialog";
import { CreateIssueDialog } from "@/components/wiki/CreateIssueDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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

const Index = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState("all");
    const [selectedIssue, setSelectedIssue] = useState<IssueData | null>(null);
    const [issueDialogOpen, setIssueDialogOpen] = useState(false);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    const { data: issues = [], isLoading } = useQuery({
        queryKey: ['issues'],
        queryFn: async () => {
            try {
                const result = await Issue.list('-updated_at', 1000);
                return result as IssueData[];
            } catch (error) {
                console.error("Error fetching issues:", error);
                return [];
            }
        }
    });

    const filteredIssues = issues.filter((issue) => {
        const matchesProduct = selectedProduct === "all" || issue.product === selectedProduct;
        
        if (!searchQuery) return matchesProduct;

        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
            issue.title.toLowerCase().includes(searchLower) ||
            issue.description.toLowerCase().includes(searchLower) ||
            issue.solution.toLowerCase().includes(searchLower) ||
            issue.product.toLowerCase().includes(searchLower) ||
            (issue.tags && issue.tags.toLowerCase().includes(searchLower)) ||
            (issue.ticket_ids && issue.ticket_ids.toLowerCase().includes(searchLower)) ||
            (issue.notes && issue.notes.toLowerCase().includes(searchLower));

        return matchesProduct && matchesSearch;
    });

    const handleIssueClick = (issue: IssueData) => {
        setSelectedIssue(issue);
        setIssueDialogOpen(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <WikiHeader />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                        <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                            <img 
                                src="https://ellprnxjjzatijdxcogk.supabase.co/storage/v1/object/public/files/chat-generated-images/project-hqlrw1mnt6kwvhubrkcte/9d6d9f34-7f21-4921-a5b6-dedcd5039631.png"
                                alt="Tech support knowledge base illustration with organized documentation and search symbols"
                                className="absolute inset-0 w-full h-full object-cover opacity-20"
                            />
                            <div className="relative text-center text-white z-10">
                                <h2 className="text-3xl font-bold mb-2">Tech Support Knowledge Base</h2>
                                <p className="text-blue-100">Find solutions to common issues quickly and efficiently</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">
                                {filteredIssues.length} {filteredIssues.length === 1 ? 'Issue' : 'Issues'}
                            </h3>
                            <p className="text-gray-600 text-sm">
                                {selectedProduct === "all" 
                                    ? "Showing all products" 
                                    : `Filtered by ${selectedProduct}`}
                            </p>
                        </div>
                        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add New Issue
                        </Button>
                    </div>

                    <SearchBar
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        selectedProduct={selectedProduct}
                        onProductChange={setSelectedProduct}
                        issueCount={issues.length}
                    />
                </div>

                <IssueList 
                    issues={filteredIssues}
                    onIssueClick={handleIssueClick}
                    isLoading={isLoading}
                />
            </main>

            <IssueDialog
                issue={selectedIssue}
                open={issueDialogOpen}
                onOpenChange={setIssueDialogOpen}
            />

            <CreateIssueDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
            />
        </div>
    );
};

export default Index;