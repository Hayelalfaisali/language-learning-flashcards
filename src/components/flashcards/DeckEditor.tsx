
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/types/flashcard";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface DeckEditorProps {
  deck?: {
    id: string;
    name: string;
    description: string;
    cards: Card[];
  };
  onSave: (deck: any) => void;
  onCancel: () => void;
}

const DeckEditor = ({ deck, onSave, onCancel }: DeckEditorProps) => {
  const [name, setName] = useState(deck?.name || "");
  const [description, setDescription] = useState(deck?.description || "");
  const [cards, setCards] = useState<Card[]>(deck?.cards || []);
  const [showCardForm, setShowCardForm] = useState(false);
  const [newCardFront, setNewCardFront] = useState("");
  const [newCardBack, setNewCardBack] = useState("");

  const handleSave = () => {
    const deckToSave = {
      id: deck?.id || uuidv4(),
      name,
      description,
      cards,
    };
    onSave(deckToSave);
  };

  const handleAddCard = () => {
    if (newCardFront.trim() && newCardBack.trim()) {
      const newCard: Card = {
        id: uuidv4(),
        front: newCardFront,
        back: newCardBack,
        lastReviewed: null,
        nextReview: null,
        level: 0
      };
      setCards([...cards, newCard]);
      setNewCardFront("");
      setNewCardBack("");
      setShowCardForm(false);
    }
  };

  const handleRemoveCard = (cardId: string) => {
    setCards(cards.filter((card) => card.id !== cardId));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Deck Name</Label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="e.g., Spanish Basics"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Brief description of this deck"
          rows={2}
        />
      </div>

      <Separator />
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Cards ({cards.length})</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowCardForm(!showCardForm)}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Card
          </Button>
        </div>

        <Collapsible open={showCardForm} onOpenChange={setShowCardForm}>
          <CollapsibleContent>
            <div className="space-y-3 p-3 border rounded-md mb-3">
              <div>
                <Label htmlFor="front">Front (Question)</Label>
                <Input 
                  id="front"
                  value={newCardFront}
                  onChange={(e) => setNewCardFront(e.target.value)}
                  placeholder="Word or phrase to learn"
                />
              </div>
              <div>
                <Label htmlFor="back">Back (Answer)</Label>
                <Input 
                  id="back"
                  value={newCardBack}
                  onChange={(e) => setNewCardBack(e.target.value)}
                  placeholder="Translation or definition"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowCardForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleAddCard}
                  disabled={!newCardFront.trim() || !newCardBack.trim()}
                >
                  Add
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {cards.length > 0 ? (
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {cards.map((card) => (
                <div 
                  key={card.id} 
                  className="flex items-center justify-between p-2 border rounded-md"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{card.front}</span>
                      <span className="text-muted-foreground">—</span>
                      <span className="text-muted-foreground truncate">{card.back}</span>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemoveCard(card.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center p-4 border rounded-md text-muted-foreground">
            No cards yet. Add some cards to your deck.
          </div>
        )}
      </div>

      <Separator />

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button 
          onClick={handleSave} 
          disabled={!name.trim() || cards.length === 0}
        >
          Save Deck
        </Button>
      </div>
    </div>
  );
};

export default DeckEditor;
