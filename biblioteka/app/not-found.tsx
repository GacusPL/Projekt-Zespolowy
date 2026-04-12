import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 sm:px-6 lg:px-8 text-center min-h-[60vh]">
      <div className="relative w-full max-w-lg mb-8">
        <div className="absolute inset-0 bg-indigo-500 blur-[80px] opacity-20 rounded-full"></div>
        <h1 className="relative text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
          404
        </h1>
      </div>
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4 animate-in slide-in-from-bottom-5 duration-500">
        Nie znaleziono strony
      </h2>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl text-center mb-8 animate-in slide-in-from-bottom-6 duration-700">
        Przepraszamy, ale strona, której szukasz, nie widnieje w naszych rejestrach. Mogła zostać przeniesiona, usunięta lub podałeś błędny adres URL.
      </p>
      <div className="flex gap-4 animate-in slide-in-from-bottom-8 duration-1000">
        <Link 
          href="/" 
          className="rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Wróć do strony głównej
        </Link>
        <Link 
          href="javascript:history.back()" 
          className="rounded-full bg-white dark:bg-gray-800 px-8 py-3.5 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:-translate-y-0.5 transition-all"
        >
          Cofnij się
        </Link>
      </div>
    </div>
  )
}
