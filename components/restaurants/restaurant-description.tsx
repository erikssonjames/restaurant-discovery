import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer"

type RestaurantDescriptionProps = {
  content: BlocksContent
}

export function RestaurantDescription({ content }: RestaurantDescriptionProps) {
  if (!content?.length) {
    return <p className="text-muted-foreground">No description is available.</p>
  }

  return (
    <div
      className={[
        "space-y-4 leading-7 text-muted-foreground",
        "[&_a]:font-medium [&_a]:text-foreground [&_a]:underline",
        "[&_blockquote]:border-l-4 [&_blockquote]:pl-4",
        "[&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-foreground",
        "[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground",
        "[&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6",
        "[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6",
      ].join(" ")}
    >
      <BlocksRenderer content={content} />
    </div>
  )
}
