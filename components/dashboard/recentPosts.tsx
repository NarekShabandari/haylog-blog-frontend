import { usePosts } from "@/hooks/queries/usePosts";
import { FileText } from "lucide-react";

export function RecentPosts() {
  const { data: posts, isLoading } = usePosts();
  return (
    <div>
      <h2 className="text-sm font-semibold text-text mb-4 flex  items-center gap-2">
        <FileText size={14} />
        Recent Posts
      </h2>
      {isLoading ? (
        <div className="space-y-3">
          {[
            ...Array(4).map((_, i) => {
              return (
                <div
                  key={i}
                  className="h-16 rounded-lg bg-subtle animate-pulse"
                ></div>
              );
            }),
          ]}
        </div>
      ) : (
        <div className="space-y-2">
          {posts?.slice(0, 8).map((post: any) => (
            <div
              key={post.id}
              className="p-3 rounded-lg border border-border bg-surface"
            >
              <p className="text-xs font-medium text-text line-clamp-1">
                {post.title}
              </p>
              <div className="flex items-center justify-between mt-1">
                <span className="font-mono text-[10px text-muted]">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
                <span
                  className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    post.published
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {post.published ? "live" : "draft"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
