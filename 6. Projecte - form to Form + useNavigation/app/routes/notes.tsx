/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import NewNote from "../components/NewNote";
import { ActionFunctionArgs, LoaderFunction, redirect } from "@remix-run/node";
import { storeNotes, getStoredNotes, Note } from "../data/notes";
import NoteList from "../components/NoteList";
import { useLoaderData } from "@remix-run/react";

// Component principal
const NotesPage = (): JSX.Element => {
  const { notes } = useLoaderData<{ notes: Note[] }>();
  console.log("Client notes:", notes);

  return (
    <main>
      <NewNote />
      {notes.length > 0 ? (
        <NoteList notes={notes} />
      ) : (
        <p className="text-gray-500 text-center">No hi ha notes disponibles</p>
      )}
    </main>
  );
};

// Loader: Carrega les notes abans de renderitzar la pàgina
export const loader: LoaderFunction = async () => {
  try {
    const notes: Note[] = (await getStoredNotes()) || [];
    return { notes }; // Wrap notes in an object
  } catch (error) {
    console.error("Error loading notes:", error);
    throw new Response("Failed to load notes", { status: 500 });
  }
};

// Action: Gestiona l'enviament de noves notes
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const noteData: Note = {
    id: new Date().toISOString(),
    title: formData.get("title") as string,
    content: formData.get("content") as string,
  };

  // Validació bàsica
  if (!noteData.title || !noteData.content) {
    return new Response("Title and content are required", { status: 400 });
  }

  const existingNotes = await getStoredNotes();
  const updatedNotes: Note[] = [...existingNotes, noteData];

  await storeNotes(updatedNotes);
  return redirect("/notes");
};

export default NotesPage;
