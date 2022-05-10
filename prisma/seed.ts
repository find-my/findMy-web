import { PostType, PrismaClient } from '@prisma/client';
const client = new PrismaClient();

async function main() {
  [...Array.from(Array(50).keys())].forEach(async (item) => {
    await client.post.create({
      data: {
        title: `${item % 2 === 0 ? `lost${item}` : `found${item - 1}`}`,
        place: `find-my corp`,
        type: item % 2 === 0 ? PostType.LOST : PostType.FOUND,
        latitude: Math.random() * (43 - 33) + 33,
        longitude: Math.random() * (132 - 124) + 124,
        description: `${item % 2 === 0 ? `찾고 있어요` : `주인 찾습니다.`}`,
        category: `없음`,
        views: 0,
        user: {
          connect: {
            id: 4,
          },
        },
      },
    });
    console.log(`${item}/50`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await client.$disconnect();
  });
