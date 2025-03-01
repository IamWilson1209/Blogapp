'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { BookmarkIcon } from 'lucide-react';
import { Button } from './ui/button';
import { toggleSaveArticle } from '@/actions/server-actions';
import { toast } from 'sonner';

type SaveButtonProps = {
  articleId: string;
  userId: string | null | undefined;
  initialSavedStatus: boolean;
  isLoggedIn: boolean;
  onlyIcon: boolean;
};

const SaveButton = ({
  articleId,
  userId,
  initialSavedStatus,
  isLoggedIn,
  onlyIcon,
}: SaveButtonProps) => {
  const [isSaved, setIsSaved] = useState(initialSavedStatus);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggleSave = async () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    startTransition(async () => {
      try {
        const result = await toggleSaveArticle(userId, articleId);
        setIsSaved(result.isSaved);
        toast.success(
          result.isSaved ? 'Article has been saved' : 'Article has beed unsaved'
        );
      } catch (error) {
        console.error('Failed to toggle save:', error);
        toast.error('Failed to toggle save status');
      }
    });
  };

  return (
    <Button
      onClick={handleToggleSave}
      disabled={isPending}
      variant={onlyIcon ? 'nothing' : 'outline'}
      className={`flex gap-2 text-[15px] ${onlyIcon ? '' : 'w-30 h-12'}`}
    >
      {isSaved ? (
        <BookmarkIcon
          className="text-black"
          fill="currentColor"
          stroke="none"
        />
      ) : (
        <BookmarkIcon size={24} />
      )}
      {onlyIcon ? null : isSaved ? (
        <p className="pr-1">Saved</p>
      ) : (
        <p className="pr-1">Save</p>
      )}
    </Button>
  );
};

export default SaveButton;
