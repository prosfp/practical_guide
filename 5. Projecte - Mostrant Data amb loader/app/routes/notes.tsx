/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import NewNote from "../components/NewNote";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { storeNotes, getStoredNotes, Note } from "../data/notes";
import NoteList from "../components/NoteList";
import { useLoaderData } from "@remix-run/react";

// Pel que fa al tipatge, en casos senzill com aquest que no passem cap paràmetre a la funció, podem utilitzar la següent sintaxi:
// JSX.Element simplement indica que la funció retornarà un element JSX.

// Component principal
const NotesPage = (): JSX.Element => {
  // Accedeix a les dades carregades pel loader
  const { notes } = useLoaderData<{ notes: Note[] }>();

  return (
    <main>
      <NewNote />
      {/* Passa les notes carregades com a prop a NoteList */}
      <NoteList notes={notes} />
    </main>
  );
};

// Tot el que posem aquí serà executat al "server" (o backend) de Remix, i no al
// client. Això vol dir que no tindrem accés a l'objecte window, per exemple.

// Loader s'executarà sempre que es faci una petició a aquesta ruta del tipus GET. Sempre que aquest
// component estigui a punt de ser renderitzat, primer s'executarà aquesta funció.

export const loader = async () => {
  const notes = await getStoredNotes(); // Obté les notes del fitxer JSON
  return Response.json({ notes }); // Retorna les notes al client
};

// Action s'executarà sempre que es faci una petició a aquesta ruta del tipus POST, PUT o DELETE (no GET).
export const action = async ({ request }: ActionFunctionArgs) => {
  // Amb una sola linia de codi, obtenim les dades del formulari
  const formData = await request.formData();

  const noteData: Note = {
    id: "",
    title: formData.get("title") as string,
    content: formData.get("content") as string,
  };

  // Afegir VALIDACIÓ

  // Recuperem les notes existents
  const existingNotes = await getStoredNotes();

  // Afegim la nova nota a la llista, abans però afegim un id únic (en aquest cas la data actual)
  noteData.id = new Date().toISOString();
  const updatedNotes: Note[] = [...existingNotes, noteData];

  // Guardem les notes
  await storeNotes(updatedNotes);

  // Podem redirigir a l'usuari on volguem
  return redirect("/notes");
};

export default NotesPage;