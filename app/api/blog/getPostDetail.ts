import prisma from "@/app/lib/prisma";
type getPostDetailProps = {
  postId: string
}

const getPostDetail = async (args: getPostDetailProps) => {
  const { postId } = args;
  try {
    const post = await prisma.posts.findFirst({
      where: {
        postId: postId
      },
      include: {
        // ユーザー情報も含める（POSTテーブルにないもの、JOIN文）
        user: {
          select: {
            name: true,
            icon: true,
          },
        },
      },
    });
    if (!post) return null
    return post;
  } catch (error) {
    console.log(error)
    return null
  }
}

export default getPostDetail;