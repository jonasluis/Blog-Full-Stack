import Link from "next/link";

export default function Header(){
    return (
    <header className="w-full px-6 py-4 border-b shadow-sm bg-white">
      <div className="container mx-auto flex justify-between items-center">
        {/* Nome do blog */}
        <Link href="/">
          <h1 className="text-xl font-bold text-black">Meu Blog</h1>
        </Link>

        {/* Links à direita */}
        <nav className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-black">
            Login
          </Link>
          <Link href="/register" className="text-sm font-medium text-gray-700 hover:text-black">
            Cadastrar
          </Link>
        </nav>
      </div>
    </header>
    )
}