
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { Deck, Card as FlashCard } from "@/types/flashcard";

interface FlashcardStudyProps {
  deck: Deck;
  onUpdateDeck: (updatedDeck: Deck) => void;
}

const FlashcardStudy = ({ deck, onUpdateDeck }: FlashcardStudyProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyCards, setStudyCards] = useState<FlashCard[]>([]);
  const [completed, setCompleted] = useState(false);

  // Set up study session
  useEffect(() => {
    if (deck && deck.cards && deck.cards.length > 0) {
      // Simple randomization of cards
      const shuffledCards = [...deck.cards].sort(() => Math.random() - 0.5);
      setStudyCards(shuffledCards);
      setCurrentIndex(0);
      setCompleted(false);
      setIsFlipped(false);
    } else {
      // Handle empty deck case
      setStudyCards([]);
      setCompleted(true);
    }
  }, [deck.id]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < studyCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      setCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const updateCardProgress = (correct: boolean) => {
    // Only proceed if we have valid cards
    if (!studyCards.length || currentIndex >= studyCards.length) {
      return;
    }
    
    const now = new Date();
    const currentCard = studyCards[currentIndex];
    const updatedCard = { 
      ...currentCard,
      lastReviewed: now.toISOString(),
      level: correct ? Math.min(currentCard.level + 1, 5) : Math.max(currentCard.level - 1, 0),
    };
    
    // Calculate next review time based on spaced repetition algorithm
    // Level 0: 1 hour, Level 1: 1 day, Level 2: 3 days, Level 3: 1 week, Level 4: 2 weeks, Level 5: 1 month
    const intervals = [1, 24, 72, 168, 336, 720]; // hours
    const nextReviewDate = new Date(now);
    nextReviewDate.setHours(nextReviewDate.getHours() + intervals[updatedCard.level]);
    updatedCard.nextReview = nextReviewDate.toISOString();
    
    // Update study session cards
    const updatedStudyCards = [...studyCards];
    updatedStudyCards[currentIndex] = updatedCard;
    setStudyCards(updatedStudyCards);
    
    // Update deck with new card data
    const updatedCards = deck.cards.map(card => 
      card.id === currentCard.id ? updatedCard : card
    );
    
    onUpdateDeck({
      ...deck,
      cards: updatedCards
    });
    
    handleNext();
  };

  const restartSession = () => {
    if (deck && deck.cards && deck.cards.length > 0) {
      setStudyCards([...deck.cards].sort(() => Math.random() - 0.5));
      setCurrentIndex(0);
      setIsFlipped(false);
      setCompleted(false);
    }
  };

  if (deck.cards.length === 0) {
    return (
      <div className="text-center p-8">
        <p>This deck has no cards to study.</p>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="max-w-md mx-auto text-center p-8 space-y-4">
        <h2 className="text-2xl font-bold">Session Complete!</h2>
        <p>You've reviewed all {studyCards.length} cards in this deck.</p>
        <Button onClick={restartSession}>Study Again</Button>
      </div>
    );
  }

  // Guard clause to prevent accessing undefined cards
  if (!studyCards || studyCards.length === 0 || currentIndex >= studyCards.length) {
    return (
      <div className="max-w-md mx-auto text-center p-8 space-y-4">
        <p>Loading cards...</p>
        <Button onClick={restartSession}>Try Again</Button>
      </div>
    );
  }

  const currentCard = studyCards[currentIndex];
  const progress = ((currentIndex) / studyCards.length) * 100;

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{deck.name}</h2>
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} of {studyCards.length}
        </span>
      </div>

      <Progress value={progress} className="mb-4" />

      <Card 
        className={`relative h-64 cursor-pointer transition-all duration-500 mx-auto ${
          isFlipped ? "bg-muted" : ""
        }`}
        onClick={handleFlip}
      >
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <CardContent className="text-center">
            <p className="text-2xl font-medium">
              {isFlipped ? currentCard.back : currentCard.front}
            </p>
            {!isFlipped && (
              <p className="text-sm text-muted-foreground mt-4">
                (Click to reveal answer)
              </p>
            )}
          </CardContent>
        </div>
      </Card>

      <div className="flex justify-between items-center mt-4">
        <Button variant="outline" onClick={handlePrev} disabled={currentIndex === 0}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>

        {isFlipped ? (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => updateCardProgress(false)}
              className="border-red-500 hover:bg-red-100"
            >
              <X className="mr-2 h-4 w-4 text-red-500" /> Again
            </Button>
            <Button 
              variant="outline"
              onClick={() => updateCardProgress(true)}
              className="border-green-500 hover:bg-green-100"
            >
              <Check className="mr-2 h-4 w-4 text-green-500" /> Got it
            </Button>
          </div>
        ) : (
          <Button onClick={handleFlip}>
            Reveal Answer
          </Button>
        )}

        <Button variant="outline" onClick={handleNext}>
          Next <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FlashcardStudy;
