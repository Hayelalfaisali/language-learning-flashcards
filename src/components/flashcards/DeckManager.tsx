
import React, { useState } from "react";
import { Plus, Edit, Trash, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import DeckEditor from "./DeckEditor";
import { Deck } from "@/types/flashcard";

interface DeckManagerProps {
  decks: Deck[];
  selectedDeckId: string | null;
  onAddDeck: (deck: Deck) => void;
  onUpdateDeck: (deck: Deck) => void;
  onDeleteDeck: (deckId: string) => void;
  onSelectDeck: (deckId: string) => void;
}

const DeckManager = ({ 
  decks, 
  selectedDeckId, 
  onAddDeck, 
  onUpdateDeck, 
  onDeleteDeck, 
  onSelectDeck 
}: DeckManagerProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDeckId, setEditingDeckId] = useState<string | null>(null);

  const handleCreateDeck = (newDeck: Deck) => {
    onAddDeck(newDeck);
    setIsAddDialogOpen(false);
  };

  const handleSaveEdit = (updatedDeck: Deck) => {
    onUpdateDeck(updatedDeck);
    setEditingDeckId(null);
  };

  const editingDeck = editingDeckId ? decks.find(deck => deck.id === editingDeckId) : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Your Flashcard Decks</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Deck
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Deck</DialogTitle>
            </DialogHeader>
            <DeckEditor 
              onSave={handleCreateDeck} 
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {decks.map((deck) => (
          <Card 
            key={deck.id} 
            className={`cursor-pointer transition-all ${selectedDeckId === deck.id ? 'border-primary' : ''}`}
          >
            <CardHeader>
              <CardTitle>{deck.name}</CardTitle>
              <CardDescription>{deck.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{deck.cards.length} cards</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => onSelectDeck(deck.id)}>
                <BookOpen className="mr-2 h-4 w-4" /> Select
              </Button>
              <div className="space-x-2">
                <Button size="icon" variant="ghost" onClick={() => setEditingDeckId(deck.id)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => onDeleteDeck(deck.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {decks.length === 0 && (
        <div className="text-center p-8">
          <p className="text-muted-foreground">You don't have any flashcard decks yet. Create one to get started!</p>
        </div>
      )}

      <Dialog open={!!editingDeck} onOpenChange={(open) => !open && setEditingDeckId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Deck</DialogTitle>
          </DialogHeader>
          {editingDeck && (
            <DeckEditor 
              deck={editingDeck} 
              onSave={handleSaveEdit} 
              onCancel={() => setEditingDeckId(null)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeckManager;
