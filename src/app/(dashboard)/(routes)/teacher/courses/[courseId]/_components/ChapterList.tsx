'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd';
import { Chapter } from '@prisma/client';
import { Grip, Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ChapterListProps {
  items: Chapter[];
  onEdit: (id: string) => void;
  onReorder: (updateData: { id: string; position: number }[]) => void;
}

export default function ChapterList({
  items,
  onEdit,
  onReorder,
}: ChapterListProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState(items);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newChapters = Array.from(chapters);
    const [removed] = newChapters.splice(result.source.index, 1);
    newChapters.splice(result.destination.index, 0, removed);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    setChapters(newChapters);

    const updatedOrder = newChapters
      .slice(startIndex, endIndex + 1)
      .map((chapter) => ({
        id: chapter.id,
        position: newChapters.findIndex((c) => c.id === chapter.id),
      }));

    onReorder(updatedOrder);
  };

  if (!isMounted) return null;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='chapters'>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {chapters.map((chapter, index) => (
              <Draggable
                draggableId={chapter.id}
                index={index}
                key={chapter.id}
              >
                {(provided) => (
                  <div
                    className={cn(
                      'flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm',
                      chapter.isPublished &&
                        'bg-indigo-100 border-indigo-200 text-indigo-700'
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      {...provided.dragHandleProps}
                      className={cn(
                        'px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition',
                        chapter.isPublished &&
                          'border-r-indigo-200 hover:bg-indigo-200'
                      )}
                    >
                      <Grip className='h-5 w-5' />
                    </div>
                    {chapter.title}
                    <div className='ml-auto pr-2 flex items-center gap-x-2'>
                      {chapter.isFree && <Badge>Free</Badge>}
                      <Badge
                        className={cn(
                          'bg-slate-500',
                          chapter.isPublished && 'bg-primary'
                        )}
                      >
                        {chapter.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                      <Pencil
                        onClick={() => onEdit(chapter.id)}
                        className='h-4 w-4 cursor-pointer transition hover:opacity-75'
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
