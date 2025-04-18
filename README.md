# AIR - Airline Website

AIR este o platforma destinata companiilor aeriene, conceputa pentru a simplifica procesul de rezervare a biletelor si pentru a oferi o experienta moderna si intuitiva atat pasagerilor, cat si administratorilor. Sistemul integreaza functionalitati esentiale pentru gestionarea zborurilor, a utilizatorilor si a rezervarilor, intr-un mod scalabil si usor de intretinut.

Aplicatia este dezvoltata cu React si TypeScript, beneficiind de un design responsive realizat cu Tailwind CSS.

## Structura Proiectului

### 1. Sectiunea Guest

Utilizatorii neinregistrati au acces la urmatoarele functionalitati:

- **Pagina Principala (Home)**: Interfata pentru cautarea zborurilor, cu filtre pentru destinatie, data si numar de pasageri.
- **Vizualizare Program Zboruri (FlightSchedule)**: Posibilitatea de a vedea toate zborurile disponibile si de a le filtra dupa diverse criterii.
- **Vizualizare Recenzii (CustomerReviews)**: Citirea recenziilor lasate de alti utilizatori.
- **Sectiunea FAQ**: Raspunsuri la intrebari frecvente despre serviciile oferite.
- **Pagina de Contact**: Informatii de contact si formular pentru mesaje.
- **Autentificare/Inregistrare**: Crearea unui cont nou sau autentificarea in sistem.

**Flux de Rezervare pentru Guest**:
1. Cautare zbor (Home)
2. Selectare zbor (FlightSchedule)
3. La incercarea de rezervare, utilizatorul este directionat catre pagina de logare
4. Dupa autentificare, este redirectionat inapoi la fluxul de rezervare

### 2. Sectiunea User
Pentru vizualizarea sectiunii pentru USER trebuie modificat **const [isConnected, setIsConnected] = useState(true);** din **NavigationBarComponent**.
Utilizatorii autentificati beneficiaza de toate functionalitatile disponibile oaspetilor, plus:

- **Profil Utilizator (UserProfile)**: Gestionarea informatiilor personale, vizualizarea istoricului comenzilor si salvarea metodelor de plata.

- **Flux Complet de Rezervare**:
  **Selectare Zbor** (FlightSchedule)
  **Alegere Tarif** (FlightFare): AIR BASE, AIR ECO, AIR PLUS
  **Selectare Locuri** (FlightSeats): Pentru tarifele AIR ECO, AIR PLUS se permite alegerea unui loc, tariful AIR BASE aloca automat un loc disponibil.
  AIR ECO permite alegerea locurilor aflate la clasa Economic. AIR plus permite alegerea locurilor aflate la clasa Economic si Business.
  **Detalii Pasageri** (FlightPassengerDetails): Introducerea informatiilor pentru fiecare pasager si optiunile de bagaj pentru care se percepe o taxa suplimentara.
  **Plata** (FlightPayment): Procesarea platii cu carduri salvate sau utilizarea unui card nou si posibilitatea salvarii acestuia.
  **Confirmare** (ConfirmationPage): Rezumatul rezervarii. Aici trebuie sa mai implementez primirea biletului electronic pe email sau in aplicatie.

- **Gestionare Rezervari**:
  - Vizualizarea tuturor comenzilor (upcoming, completed, cancelled) si filtrarea acestora in functie de status.
  - Se pot lasa recenzii pentru zborurile finalizate

- **Gestionare Metode de Plata**:
  - Adaugarea, editarea si stergerea cardurilor
  - Setarea unui card ca implicit

- **Gestionare Informatii Personale**:
  - Editarea informatiilor personale
  - Modificarea parolei

### 3. Sectiunea Admin
Sectiunea poate fi accesata cu ajutorul **butonului Admin** din **FooterComponent**.
Administratorii au acces la un panou de control dedicat cu urmatoarele functionalitati:

- **Panou Principal (Admin Dashboard)**: Prezentare generala a activitatii platformei, inclusiv statistici si grafice.

- **Gestionare Zboruri (AdminSchedules)**:
  - Vizualizarea tuturor zborurilor
  - Adaugarea zborurilor noi (AddFlight)
    Se pot adauga zboruri cu maxim 2 tranzite. Pentru zborurile cu tranzit se poate alege crearea unui nouu zbor pentru o sectiune sau alegerea unui zbor existent (se cauta in lista de zboruri in functie de orasul de plecare si sosire, daca nu exista orase se afiseaza mesaj).

  - Modificarea zborurilor existente (ModifyFlight). 
    Pentru schimbari permanente va salva statusul zborului modificat si se va crea un zbor nou care va fi disponibil de la data selectata. Data selectata trebuie sa fie o data in care nu exista persoane care si-au cumparat bilet cu acel zbor (trebuie sa implementez disponibilitatea vizibila in calendar in momentul alegerii datei). 

    Pentru intarzieri, acestea se pot face cu minim trei ore inainte de decolare (implementare verificari).

    Pentru anulari, acestea se pot face cu minim 24 de ore inainte de decolare (implementare verificari).

- **Urmarire Zboruri in Timp Real (FlightTracking)**:
  - Monitorizarea zborurilor active, upcoming, cancelled, completed. Zborurile sunt upcoming daca mai sunt 3 ore pana la decolare, active daca sunt in desfasurare, in cazul in care mai sunt cateva zile sau mai mult de 3 ore pana la decolare acestea sunt completed.

- **Profil Administrator (AdminProfile)**:
  - Gestionarea datelor personale
  
- **Trebuie sa mai implementez**:
  - Adaugarea unei pagini de modificare a datelor de contact
  - Adaugarea unei pagini de modificare a preturilor pentru bagaje extra
  - Adaugarea unei pagini pentru modificarea tarifelor