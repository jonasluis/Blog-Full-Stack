import Link from "next/link";

export default function Header(){
    return (
        <header>
            <div className="w-full px-6 py-4 border-b shadow-sm bg-white">
                <div className="container mx-auto flex justify-between items-center">
                <Link href="/">
                    <h1 className="text-xl font-bold text-black">Admin Panel</h1>
                </Link>
                <nav className="flex items-center gap-6">
                <Link href="/admin/posts" className="text-sm font-medium text-gray-700 hover:text-black">
                    Criar Artigo
                </Link>
        </nav>
                </div>
            </div>
        </header>
    )
}