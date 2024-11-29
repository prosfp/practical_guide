Remix incorpora **Form** que permet enviar dades a través de fetch i actualitzar la pàgina sense recarregar-la. Aquesta funcionalitat és molt útil per a formularis, ja que permet enviar dades sense perdre l'estat de la pàgina.

https://remix.run/docs/en/main/components/form

Per treballar en un model Single Page prioritzarem l'ús de Form en comptes de l'etiqueta `<form>` de HTML. Això ens permetrà gestionar les dades de manera més eficient i sense recarregar la pàgina.

> **Nota Important:** Estic experimentant problemes amb la versió DEV de Vite amb la recàrrega de pàgina. Això pot ser degut a la configuració de Vite o a un problema amb Remix. Per tant, de moment executeu `npm run build` i `npm run preview` per veure els canvis.


Anem a veure com evitar