
# Projekt-Zespolowy
https://projekt-zespolowy-biblioteka.vercel.app?_vercel_share=zhCMHbuDhihqLXJQ7xdmn9Nt8qfsyMwP

# 📚 System Zarządzania Biblioteką (Biblioteka App)

Nowoczesna aplikacja webowa do zarządzania księgozbiorem, zbudowana w oparciu o architekturę server-side. Projekt umożliwia przeglądanie katalogu książek przez użytkowników oraz pełne zarządzanie zasobami przez administratorów.

## 🚀 Technologie
Projekt wykorzystuje nowoczesny stos technologiczny zapewniający wydajność i skalowalność:
* **Framework:** [Next.js 15](https://nextjs.org/) 
* **Język:** TypeScript
* **Baza danych i Auth:** [Supabase](https://supabase.com/) 
* **Stylizacja:** Tailwind CSS
* **Zarządzanie stanem:** Server Actions & React Hooks

## ✨ Funkcje systemu

### 🏠 Panel Użytkownika
* **Katalog książek:** Przeglądanie dostępnych pozycji w formie estetycznych kart.
* **Wyszukiwanie i Filtrowanie:** Możliwość filtrowania książek po kategoriach (np. Fantastyka, IT, Algorytmy).
* **Status dostępności:** Dynamiczne sprawdzanie liczby dostępnych egzemplarzy w czasie rzeczywistym.

### 🛡️ Panel Administratora (`/admin/books`)
* **Zarządzanie zasobami (CRUD):**
    * **Dodawanie:** Formularz z walidacją do wprowadzania nowych pozycji.
    * **Edycja:** Możliwość aktualizacji danych książek wraz z automatycznym przeliczaniem dostępności.
    * **Usuwanie:** Bezpieczne usuwanie z obsługą błędów integralności (system blokuje usunięcie książki, która posiada aktywne rezerwacje).
* **Bezpieczeństwo:** Dostęp do panelu chroniony autoryzacją Supabase Auth.

## 🛠️ Struktura Projektu
* `/app` - Główna logika routingu Next.js.
    * `/admin/books` - Strona administracyjna i Server Actions.
    * `/auth` - Obsługa logowania i rejestracji.
* `/components` - Reużywalne komponenty interfejsu (Navbar, Footer).
* `/supabase` - Skrypty SQL i konfiguracja bazy danych.
* `/utils` - Konfiguracja klienta Supabase.

