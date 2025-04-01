import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { PlusCircle, Save, Trash2 } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface NotesTabProps {
  businessId: string;
  onUpdateNotes?: (notes: string) => void;
}

const NotesTab = ({ businessId, onUpdateNotes = () => {} }: NotesTabProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNotes = async () => {
      if (!businessId) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("notes")
          .select("*")
          .eq("business_id", businessId)
          .order("updated_at", { ascending: false });

        if (error) throw error;

        setNotes(data || []);
        if (data && data.length > 0) {
          setCurrentNote(data[0]);
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
        toast({
          title: "Error",
          description: "Failed to load notes. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [businessId]);

  const handleCreateNote = async () => {
    if (!businessId || !user) return;

    try {
      setIsSaving(true);
      const newNote = {
        title: "New Note",
        content: "",
        business_id: businessId,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("notes")
        .insert(newNote)
        .select()
        .single();

      if (error) throw error;

      setNotes([data, ...notes]);
      setCurrentNote(data);
      toast({
        title: "Note created",
        description: "Your new note has been created.",
      });
    } catch (error) {
      console.error("Error creating note:", error);
      toast({
        title: "Error",
        description: "Failed to create note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNote = async () => {
    if (!currentNote || !businessId) return;

    try {
      setIsSaving(true);
      const { error } = await supabase
        .from("notes")
        .update({
          title: currentNote.title,
          content: currentNote.content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentNote.id);

      if (error) throw error;

      // Update the notes list with the updated note
      setNotes(
        notes.map((note) =>
          note.id === currentNote.id
            ? {
                ...note,
                title: currentNote.title,
                content: currentNote.content,
                updated_at: new Date().toISOString(),
              }
            : note,
        ),
      );

      toast({
        title: "Note saved",
        description: "Your note has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving note:", error);
      toast({
        title: "Error",
        description: "Failed to save note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!noteId) return;

    try {
      const { error } = await supabase.from("notes").delete().eq("id", noteId);

      if (error) throw error;

      // Remove the deleted note from the list
      const updatedNotes = notes.filter((note) => note.id !== noteId);
      setNotes(updatedNotes);

      // If the current note was deleted, select another note if available
      if (currentNote && currentNote.id === noteId) {
        setCurrentNote(updatedNotes.length > 0 ? updatedNotes[0] : null);
      }

      toast({
        title: "Note deleted",
        description: "Your note has been deleted.",
      });
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Notes</h2>
        <Button
          onClick={handleCreateNote}
          disabled={isSaving}
          className="gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          New Note
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 border rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-3 border-b">
            <h3 className="font-medium">Note List</h3>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {notes.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notes yet. Create your first note.
              </div>
            ) : (
              <ul className="divide-y">
                {notes.map((note) => (
                  <li
                    key={note.id}
                    className={`p-3 cursor-pointer hover:bg-gray-50 ${currentNote?.id === note.id ? "bg-blue-50" : ""}`}
                    onClick={() => setCurrentNote(note)}
                  >
                    <div className="font-medium truncate">{note.title}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Updated {formatDate(note.updated_at)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          {currentNote ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Input
                  value={currentNote.title}
                  onChange={(e) =>
                    setCurrentNote({ ...currentNote, title: e.target.value })
                  }
                  className="text-lg font-medium"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveNote}
                    disabled={isSaving}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteNote(currentNote.id)}
                    className="text-red-500 gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
              <Textarea
                value={currentNote.content}
                onChange={(e) =>
                  setCurrentNote({ ...currentNote, content: e.target.value })
                }
                placeholder="Add your notes here..."
                className="min-h-[300px] resize-y"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] border rounded-lg p-6 text-center">
              <p className="text-gray-500 mb-4">
                {notes.length === 0
                  ? "No notes yet. Create your first note to get started."
                  : "Select a note from the list to view or edit."}
              </p>
              {notes.length === 0 && (
                <Button onClick={handleCreateNote} disabled={isSaving}>
                  Create Note
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesTab;
