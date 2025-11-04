import { QuickLink } from "@/types/app";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { AddQuickLinkDialog } from "./AddQuickLinkDialog";
import { EditQuickLinkDialog } from "./EditQuickLinkDialog";
import { useState } from "react";
import { toast } from "sonner";

interface QuickLinksTabProps {
  links: QuickLink[];
  onAddLink: (link: Omit<QuickLink, "id">) => void;
  onEditLink: (id: string, link: Omit<QuickLink, "id">) => void;
  onDeleteLink: (id: string) => void;
}

export const QuickLinksTab = ({ links, onAddLink, onEditLink, onDeleteLink }: QuickLinksTabProps) => {
  const [editingLink, setEditingLink] = useState<QuickLink | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEdit = (link: QuickLink) => {
    setEditingLink(link);
    setEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    onDeleteLink(id);
  };

  const groupedLinks = links.reduce((acc, link) => {
    if (!acc[link.category]) {
      acc[link.category] = [];
    }
    acc[link.category].push(link);
    return acc;
  }, {} as Record<string, QuickLink[]>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-foreground">Quick Links</h3>
        <AddQuickLinkDialog onAddLink={onAddLink} />
      </div>

      {links.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-6xl mb-4 opacity-50">🔗</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No quick links yet</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Add links to important resources like Google Sheets, Drive folders, or frequently used websites
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedLinks).map(([category, categoryLinks]) => (
            <div key={category}>
              <h4 className="text-lg font-medium text-foreground mb-3">{category}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryLinks.map((link) => (
                  <Card 
                    key={link.id} 
                    className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-3">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 flex-1 min-w-0 hover:text-primary transition-colors"
                        >
                          <ExternalLink className="h-4 w-4 flex-shrink-0" />
                          <span className="font-medium truncate">{link.name}</span>
                        </a>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleEdit(link)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(link.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <EditQuickLinkDialog
        link={editingLink}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onEditLink={onEditLink}
      />
    </div>
  );
};
