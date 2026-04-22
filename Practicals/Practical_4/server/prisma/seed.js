const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting database seed...');
    
    console.log('Clearing existing data...');
    await prisma.commentLike.deleteMany();
    console.log('  ✓ Cleared comment likes');
    
    await prisma.videoLike.deleteMany();
    console.log('  ✓ Cleared video likes');
    
    await prisma.follow.deleteMany();
    console.log('  ✓ Cleared follows');
    
    await prisma.comment.deleteMany();
    console.log('  ✓ Cleared comments');
    
    await prisma.video.deleteMany();
    console.log('  ✓ Cleared videos');
    
    await prisma.user.deleteMany();
    console.log('  ✓ Cleared users');

    const password = await bcrypt.hash('123456', 10);

    console.log('\nCreating users...');
    const users = [];
    
    const user1 = await prisma.user.create({
      data: {
        username: 'user1',
        email: 'user1@example.com',
        password,
        name: 'User 1'
      }
    });
    users.push(user1);
    console.log(`  ✓ Created: ${user1.username}`);

    const user2 = await prisma.user.create({
      data: {
        username: 'user2',
        email: 'user2@example.com',
        password,
        name: 'User 2'
      }
    });
    users.push(user2);
    console.log(`  ✓ Created: ${user2.username}`);

    const user3 = await prisma.user.create({
      data: {
        username: 'user3',
        email: 'user3@example.com',
        password,
        name: 'User 3'
      }
    });
    users.push(user3);
    console.log(`  ✓ Created: ${user3.username}`);

    console.log('\nCreating videos...');
    const video1 = await prisma.video.create({
      data: {
        title: 'Video 1 by user1',
        description: 'Sample description for video 1',
        url: 'https://example.com/video1.mp4',
        thumbnail: 'https://example.com/thumb1.jpg',
        userId: user1.id
      }
    });
    console.log(`  ✓ Created: ${video1.title}`);

    const video2 = await prisma.video.create({
      data: {
        title: 'Video 2 by user2',
        description: 'Sample description for video 2',
        url: 'https://example.com/video2.mp4',
        thumbnail: 'https://example.com/thumb2.jpg',
        userId: user2.id
      }
    });
    console.log(`  ✓ Created: ${video2.title}`);

    console.log('\nCreating comments...');
    const comment1 = await prisma.comment.create({
      data: {
        text: 'Nice video!',
        userId: user2.id,
        videoId: video1.id
      }
    });
    console.log(`  ✓ Created comment 1`);

    const comment2 = await prisma.comment.create({
      data: {
        text: 'This is amazing! 🔥',
        userId: user1.id,
        videoId: video2.id
      }
    });
    console.log(`  ✓ Created comment 2`);

    console.log('\nCreating likes...');
    const like1 = await prisma.videoLike.create({
      data: {
        userId: user1.id,
        videoId: video2.id
      }
    });
    console.log(`  ✓ Created video like 1`);

    const like2 = await prisma.videoLike.create({
      data: {
        userId: user3.id,
        videoId: video1.id
      }
    });
    console.log(`  ✓ Created video like 2`);

    console.log('\nCreating follows...');
    const follow1 = await prisma.follow.create({
      data: {
        followerId: user2.id,
        followingId: user1.id
      }
    });
    console.log(`  ✓ Created follow 1 (user2 follows user1)`);

    const follow2 = await prisma.follow.create({
      data: {
        followerId: user3.id,
        followingId: user1.id
      }
    });
    console.log(`  ✓ Created follow 2 (user3 follows user1)`);

    console.log('\n✅ Database seeded successfully!');
  } catch (error) {
    console.error('\n❌ Error during seeding:', error.message);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });