import dynamic from "next/dynamic";
import AuthGuard from "@/components/AuthGuard";


const ArticleForm = dynamic(() => import("@/components/ArticleForm"), { ssr: false });

export default function CreatePosts() {
  
  return (
    <AuthGuard>
      <ArticleForm />
    </AuthGuard>
  );
}
