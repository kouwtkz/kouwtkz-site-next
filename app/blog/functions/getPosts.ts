const prisma: any = {};
import { AutoAllotDate } from "@/app/components/System/DateFunctions";
import { Post } from "../Post";
let postList: Post[] = [];

type getPostsProps = {
  json: Post[] | string
  update?: boolean
  take?: number
  page?: number
  q?: string
  common?: boolean
  pinned?: boolean
}

export default async function getPosts({ json, update = false, take, page, common, q = "", pinned = false }: getPostsProps) {
  if (!postList || update) postList = typeof (json) === "string" ? JSON.parse(json) : json;
  if (page) page--;
  const skip = (take && page) ? take * page : undefined;
  const options = {};

  const where = setWhere(q, options);
  if (common) where.push(
    { draft: false, date: { lte: new Date() } }
  )
  const orderBy: any[] = []
  if (pinned) orderBy.push({ pin: "desc" })
  orderBy.push({ date: "desc" })

  try {
    const posts: Post[] = await prisma.post.findMany({
      where: {
        AND: where,
      },
      take,
      skip,
      orderBy,
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
    const count = await prisma.post.count({
      where: {
        AND: where,
      },
    });
    const max = Math.ceil(count / (take || 1));
    return { posts, count, max };
  } catch (e) {
    console.log(e);
    return { posts: [], count: 0, max: 0 }
  }
}

type logical = "AND" | "OR" | "NOT";
type findManyProps = {
  where: {[P in keyof Post]: boolean};
}
function findMany({where} : findManyProps) {
  where.body
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
              date: { gte: AutoAllotDate({ value: String(filterValue), dayFirst: true }) }
            })
          break;
        case 'until':
          where.push(
            {
              date: { lte: AutoAllotDate({ value: String(filterValue), dayLast: true }) }
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