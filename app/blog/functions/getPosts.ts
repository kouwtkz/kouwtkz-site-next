import prisma from "@/app/lib/prisma";
type getPostsProps = {
  max?: number
  page?: number
  q?: string
}

export default async function getPosts(args?: getPostsProps) {
  const max = args && args.max ? args.max : 0xffff;
  const page = args && args.page ? args.page : 1;
  const q = args && args.q ? args.q : "";
  const options = {};

  const where = setWhere(q, options);

  try {
    const posts = await prisma.post.findMany({
      where: {
        AND: where,
      },

      orderBy: {
        // 降順
        date: "desc",
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
    return posts;
  } catch {
    return []
  }
}

type WhereOptionsType = {
  hidden?: {
    draft?: boolean
  };
}
function setWhere(q: string, options: WhereOptionsType) {
  const hiddenOption = options.hidden || { draft: false }
  const where = [] as any[];
  let OR = false, OR_skip = false;
  const searchArray = q.replace(/^\s+|\s+$/, "").split(/\s+/);
  searchArray.forEach((item) => {
    if (item === "OR") {
      OR = true;
      OR_skip = true;
    }
    else if (item.slice(0, 1) === "#") {
      const filterValue = item.slice(1);
      where.push({
        OR: [{
          category: {
            equals: filterValue
          }
        }, {
          body: {
            contains: `#${filterValue}`
          }
        }]
      })
    } else {
      const filterKey = item.slice(0, item.indexOf(":"));
      const filterValue = item.slice(filterKey.length + 1);
      switch (filterKey) {
        case "title":
        case "body":
          where.push(
            {
              [filterKey]: {
                contains: filterValue
              }
            })
          break;
        case "cat":
        case "category":
          where.push(
            {
              category: {
                equals: filterValue
              }
            })
          break;
        case "tag":
        case "hashtag":
          where.push(
            {
              body: {
                contains: `#${filterValue}`
              }
            })
          break;
        case 'user':
          where.push(
            {
              user: {
                name: {
                  contains: filterValue
                }
              }
            })
          break;
        case 'from':
          where.push(
            {
              userId: {
                equals: filterValue
              }
            })
          break;
        case 'since':
          where.push(
            {
              date: { gte: new Date(filterValue) }
            })
          break;
        case 'until':
          where.push(
            {
              date: { lte: new Date(filterValue) }
            })
          break;
        case 'filter':
        case 'has':
          switch (filterValue.toLowerCase()) {
            case "media":
            case "images":
              where.push(
                {
                  body: {
                    contains: "![%](%)"
                  }
                })
              break;
            case "publish":
              where.push(
                {
                  draft: {
                    equals: false
                  }
                })
              break;
            case "draft":
              where.push(
                {
                  draft: {
                    equals: true
                  }
                })
              break;
            case "pinned":
              where.push(
                {
                  pin: {
                    gt: 0
                  }
                })
              break;
            case "no-pinned":
              where.push(
                {
                  pin: {
                    equals: 0
                  }
                })
              break;
            case "secret-pinned":
              where.push(
                {
                  pin: {
                    lt: 0
                  }
                })
              break;
            case "default":
              hiddenOption.draft = true;
              where.push(
                {
                  AND: [
                    {
                      draft: {
                        equals: false
                      },
                    }
                  ]
                })
              break;
          }
          break;
        default:
          where.push(
            {
              body: {
                contains: item
              }
            })
          break;
      }
    }
    if (OR_skip) {
      OR_skip = false;
    } else if (OR) {
      const current = where.pop();
      const before = where.pop();
      if (before.OR) {
        before.OR.push(current);
        where.push(before);
      } else {
        where.push({
          OR: [
            before,
            current
          ]
        })
      }
      OR = false;
    }
  })
  options.hidden = hiddenOption;
  return where;
}