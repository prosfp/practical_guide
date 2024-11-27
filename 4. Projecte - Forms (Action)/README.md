### **Introducció a Forms a Remix**

Els **forms (formularis)** són una part central de Remix i aprofiten els principis bàsics del web per gestionar la **mutació de dades**. Remix treballa amb formularis HTML tradicionals i els combina amb **tecnologia moderna** per oferir una experiència d'usuari fluida i senzilla.

---

### **Principals Característiques dels Forms a Remix**

1. **Emulació de navegació HTML:**
   - Quan un formulari s'envia, Remix evita el comportament predeterminat del navegador i gestiona la petició amb **client-side fetch**.
   - Aquest enfocament simplifica el codi, eliminant la necessitat de gestionar manualment estats amb `useState` o `useEffect`.

2. **Propietat `method`:**
   - Pots utilitzar `GET`, `POST`, `PUT` o `DELETE` segons l'acció que necessitis.
   - Exemple:
     ```tsx
     <Form method="post">
       <input type="text" name="note" placeholder="Write a note" />
       <button type="submit">Save</button>
     </Form>
     ```

3. **Actions i Loaders:**
   - **`action`**: Gestiona la lògica quan s'envien dades (POST, PUT, etc.).
   - **`loader`**: Carrega dades abans de renderitzar la pàgina.
   - Exemple bàsic d'un `action`:
     ```tsx
     export const action = async ({ request }: ActionArgs) => {
       const formData = await request.formData();
       const note = formData.get("note");
       // Guarda la nota o processa la lògica
       return redirect("/notes");
     };
     ```

4. **Revalidació automàtica:**
   - Després d'una acció (`action`), Remix torna a executar els `loaders` per assegurar que les dades a la pàgina estiguin actualitzades.

5. **Degradació progressiva (Progressive Enhancement):**
   - Els formularis funcionen tant amb **JavaScript habilitat** com deshabilitat. Sense JavaScript, el navegador enviarà una petició HTTP tradicional.

---

### **Exemple Bàsic d'un Form a Remix**

```tsx
import { Form } from "@remix-run/react";

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const note = formData.get("note");
  console.log("Nova nota:", note);
  return null;
};

export default function NotesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create a New Note</h1>
      <Form method="post" className="space-y-4">
        <input
          type="text"
          name="note"
          placeholder="Write your note here"
          className="border rounded-lg p-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Save Note
        </button>
      </Form>
    </div>
  );
}
```

---

### **Flux de treball del Form a Remix**
1. **Renderització inicial:**
   - Es carrega la pàgina amb el formulari. El component es renderitza amb els loaders predefinits (si n'hi ha).
2. **Enviament del formulari:**
   - Quan l'usuari fa clic al botó "Submit", les dades del formulari s'envien al servidor.
3. **Execució de l'`action`:**
   - Les dades s'envien a la funció `action` de la ruta, on es processa la lògica del backend.
4. **Revalidació i renderització:**
   - Després de l'acció, Remix revalida les dades mitjançant els loaders per actualitzar el contingut de la pàgina.

---

### **Punts Clau a Recordar**
- **Evita la necessitat de `useState` per manejar inputs:** Remix gestiona automàticament la serialització del formulari.
- **Automàticament funciona amb navegadors sense JavaScript.**
- És compatible amb qualsevol mètode HTTP (`GET`, `POST`, `PUT`, `DELETE`).
- Les accions són més senzilles d'escriure perquè Remix utilitza les APIs natives del web, com `request.formData()`.

---

# Sobre el codi d'aquesta lliçó

D'entrada sense haver modificat res si intentes afegir un nou Note a través del formulari, veuràs que, encara que ens retorna un 405 Method Not Allowed. Això és degut a que no tenim cap `action` definida a la nostra ruta `routes/notes.tsx`.
Tot i aixi Remix per defecte envia una petició POST a la mateixa ruta on està el formulari, en aquest cas `routes/notes.tsx`. Per tant, si volem que el formulari funcioni correctament, hem de definir una funció `action` a la mateixa ruta. Pots veure-ho a través del developer tools del navegador. Veuràs una petició POST a la mateixa ruta on està el formulari.

```tsx
export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const note = formData.get("note");
  console.log("Nova nota:", note);
  return redirect("/notes");
};
```

Ens generem "utility Functions" per a la gestió de les notes, així que aquesta funció `action` simplement recull la nova nota i la redirigeix a la pàgina de notes.

```tsx
import fs from "fs/promises";

// Defineix el tipus per a una nota individual
export interface Note {
  id: string;
  title: string;
  content: string;
}

const DATA_FILE = "notes.json";

// Llegeix les notes guardades d'un fitxer JSON
export async function getStoredNotes(): Promise<Note[]> {
  try {
    const rawFileContent = await fs.readFile(DATA_FILE, { encoding: "utf-8" });
    const data = JSON.parse(rawFileContent);
    // Retorna les notes o un array buit si no hi ha notes
    return data.notes ?? [];
  } catch (error) {
    // Si el fitxer no existeix, retorna un array buit
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error; // Si és un altre error, llença'l
  }
}

// Desa notes en un fitxer JSON
export async function storeNotes(notes: Note[]): Promise<void> {
  const jsonData = JSON.stringify({ notes: notes || [] }, null, 2);
  await fs.writeFile(DATA_FILE, jsonData, { encoding: "utf-8" });
}
```
A l'arrel del nostre projecte, generem l'arxiu `notes.json` amb una nota per defecte.

```json
{
  "notes": [
    {
      "id": 1,
      "title": "First Note",
      "content": "This is the content of the first note."
    },
    {
      "id": 2,
      "title": "Second Note",
      "content": "This is the content of the second note."
    },
    {
      "id": 3,
      "title": "Third Note",
      "content": "This is the content of the third note."
    }
  ]
}

```

Anem ara a implementar la lògica a la nostra funció `action` per a que aquesta nova nota es guardi a la nostra base de dades.

```tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import NewNote from "../components/NewNote";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { storeNotes, getStoredNotes, Note } from "../data/notes";

// Pel que fa al tipatge, en casos senzill com aquest que no passem cap paràmetre a la funció, podem utilitzar la següent sintaxi:
// JSX.Element simplement indica que la funció retornarà un element JSX.

const NotesPage = (): JSX.Element => {
  return (
    <main>
      <NewNote />
    </main>
  );
};

// Tot el que posem aquí serà executat al "server" (o backend) de Remix, i no al
// client. Això vol dir que no tindrem accés a l'objecte window, per exemple.

// Action s'executarà sempre que es faci una petició a aquesta ruta del tipus POST, PUT o DELETE (no GET).
export const action = async ({ request }: ActionFunctionArgs) => {
  // Amb una sola linia de codi, obtenim les dades del formulari
  const formData = await request.formData();

  // const noteData = {
  //   title: formData.get("title"),
  //   note: formData.get("content"),
  // };

  // Encara més òptim amb Object.fromEntries que ens permet crear un objecte a partir d'un array de parells clau-valor
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
```


